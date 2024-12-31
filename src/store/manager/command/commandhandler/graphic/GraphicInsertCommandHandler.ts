import * as math from 'mathjs';
import GraphicModel from 'model/node/graphic/GraphicModel';
import GraphicModelEditRequest from 'store/container/edit/GraphicModelEditRequest';
import AppContext from 'store/context/AppContext';
import CommandHandler from 'store/manager/command/commandhandler/CommandHandler';
import { ICommandHandlerResponse } from 'types/store/command/CommandTypes';
import CoordinateInfo from 'model/node/graphic/info/CoordinateInfo';
import { IPoint, ISize } from 'types/common/geometry/GeometryTypes';
import { isWHSwitched } from 'util/coordinate/CoordinateUtil';
import { CommandEnum } from 'types/store/command/CommandEnum';
import { ShapeTypeEnum } from 'types/model/node/graphic/ShapeTypeEnum';
import { createGraphicModelForInsertCommand } from 'util/node/graphic/GraphicModelCreateUtil';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import {
  clearGraphicEditContext,
  updateNewSelectionContainer,
} from 'util/node/graphic/edit/GraphicModelEditingUtil';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import { getRootGroup, isGroup } from 'util/node/graphic/GraphicModelTreeNodeUtil';
import { getAccumulatedTransformMatrix } from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';
import { isGraphicModel } from 'util/node/TreeNodeTypeGuards';
import SetGraphicAttributeCommand from '../../simplecommand/node/graphic/SetGraphicAttributeCommand';
import AppendTreeNodeCommand from '../../simplecommand/node/AppendTreeNodeCommand';
import RequestRerenderTreeNodeComponentCommand from '../../simplecommand/rerender/RequestRerenderTreeNodeComponentCommand';

interface IGraphicInsertSetUpCommandProps {
  commandId: CommandEnum.GRAPHIC_INSERT_SET_UP;
  shapeType: ShapeTypeEnum;
}

interface IGraphicInsertDefaultCommandProps {
  commandId:
    | CommandEnum.GRAPHIC_INSERT
    | CommandEnum.GRAPHIC_INSERT_DUPLICATE // CTRL + MOVE
    | CommandEnum.GRAPHIC_INSERT_ABORT;
}

type GraphicInsertCommandProps =
  | IGraphicInsertSetUpCommandProps
  | IGraphicInsertDefaultCommandProps;

/**
 * graphic model을 삽입하는 동작을 수행하는 command handler입니다.
 */
export default class GraphicInsertCommandHandler extends CommandHandler {
  /**
   * 실제 command handler내부에서 동작을 수행하는 부분입니다.
   *
   * @param props command 를 수행하는 데 필요한 정보를 담고 있는 CommandProps
   * @param ctx 현재 app의 상태를 담고있는 AppContext
   * @returns command 수행 결과에 따른 CommandHandlerResponse
   */
  public processCommand(
    ctx: AppContext,
    commandProps: GraphicInsertCommandProps
  ): ICommandHandlerResponse {
    switch (commandProps.commandId) {
      case CommandEnum.GRAPHIC_INSERT_SET_UP: {
        this.setUpGraphicModelInsertContext(ctx, commandProps as IGraphicInsertSetUpCommandProps);
        break;
      }
      case CommandEnum.GRAPHIC_INSERT: {
        this.insertGraphicModel(ctx, commandProps);
        break;
      }
      case CommandEnum.GRAPHIC_INSERT_DUPLICATE: {
        this.insertGraphicModelByDuplicate(ctx, commandProps);
        break;
      }
      case CommandEnum.GRAPHIC_INSERT_ABORT: {
        this.clearGraphicModelInsertContext(ctx);
        break;
      }
      default: {
        break;
      }
    }
    return { isValid: true, terminate: true };
  }

  private setUpGraphicModelInsertContext(
    ctx: AppContext,
    commandProps: IGraphicInsertSetUpCommandProps
  ): void {
    const graphicModel = createGraphicModelForInsertCommand(commandProps.shapeType);

    this.clearGraphicModelInsertContext(ctx);

    const editableContext = ctx.getEditableContext();
    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    editableContext.setEventState(EventStateEnum.GRAPHIC_INSERT);

    graphicEditInfoContainer.setEventTargetGraphicModel(graphicModel);
    graphicEditInfoContainer.appendEditPreviewLayerGraphicModel(graphicModel);
    graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.READY);

    ctx
      .getEditableContext()
      .getProxyLayerInfoContainer()
      .enableEditViewProxyLayer(graphicModel, { cursorType: 'crosshair' }, true);
  }

  private insertGraphicModel(ctx: AppContext, prop: IGraphicInsertDefaultCommandProps): void {
    const editableContext = ctx.getEditableContext();
    const parentModel = editableContext.getTreeNodeRoot();
    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    const commandController = editableContext.getCommandController();

    const graphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (graphicModel !== undefined && commandController !== undefined) {
      commandController?.appendSimpleCommand(new AppendTreeNodeCommand(graphicModel, parentModel));
      commandController?.appendPostSimpleCommand(
        new RequestRerenderTreeNodeComponentCommand(ctx, parentModel, true, true)
      );

      updateNewSelectionContainer(ctx, [graphicModel]);
    }

    this.clearGraphicModelInsertContext(ctx);
  }

  private insertGraphicModelByDuplicate(
    ctx: AppContext,
    prop: IGraphicInsertDefaultCommandProps
  ): void {
    const editableContext = ctx.getEditableContext();
    const treeNodeRoot = editableContext.getTreeNodeRoot();
    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    graphicEditInfoContainer.setIsBeingEditedToAllEditingDependentGraphicModels(false);
    const editingGraphicModels = graphicEditInfoContainer.getEditingGraphicModelList();

    const commandController = editableContext.getCommandController();

    if (commandController !== undefined) {
      editingGraphicModels.forEach(newShapeModel => {
        const graphicModelEditRequest =
          graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(newShapeModel);

        if (graphicModelEditRequest !== undefined) {
          const coordinateInfo = newShapeModel.getCoordinateInfo();

          const currentEditingCoordinateInfo =
            graphicModelEditRequest.getCurrentEditingCoordinateInfo();
          coordinateInfo.setX(currentEditingCoordinateInfo.getX());
          coordinateInfo.setY(currentEditingCoordinateInfo.getY());

          commandController.appendSimpleCommand(
            new AppendTreeNodeCommand(newShapeModel, newShapeModel.getParent() ?? treeNodeRoot)
          );
        }
      });
      commandController.preExecuteCommand();

      this.updateParentGroupCoordinate(ctx, graphicEditInfoContainer);

      updateNewSelectionContainer(ctx, editingGraphicModels);
    }

    this.clearGraphicModelInsertContext(ctx);
  }

  private updateParentGroupCoordinate(
    ctx: AppContext,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): void {
    const editingGraphicModelList = graphicEditInfoContainer.getEditingGraphicModelList();
    const editRequestMap = graphicEditInfoContainer.getEditingDependentGraphicModelEditRequestMap();

    const rootGroupSet = new Set<GraphicModel>();

    editingGraphicModelList.forEach(graphicModel => {
      const rootGroup = getRootGroup(graphicModel);
      if (rootGroup) rootGroupSet.add(rootGroup);
    });

    rootGroupSet.forEach(rootGroup => {
      this.updateGroupCoordinate(rootGroup, editingGraphicModelList, editRequestMap);
    });

    this.applyEditRequest(ctx, editRequestMap);
  }

  private getChildGraphicModelList(
    parentGroup: GraphicModel,
    targetGraphicModels: GraphicModel[]
  ): GraphicModel[] {
    const childGraphicModelList = new Array<GraphicModel>();

    targetGraphicModels.forEach(targetModel => {
      if (targetModel.getParent() === parentGroup) {
        childGraphicModelList.push(targetModel);
      }
    });

    parentGroup.forEachChild(child => {
      if (isGraphicModel(child)) {
        childGraphicModelList.push(child);
      }
    });

    return childGraphicModelList;
  }

  private updateGroupCoordinate(
    parentGroup: GraphicModel,
    targetGraphicModels: GraphicModel[],
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ): void {
    const childGraphicModelList = this.getChildGraphicModelList(parentGroup, targetGraphicModels);
    childGraphicModelList.forEach(graphicModel => {
      if (isGroup(graphicModel) === true) {
        this.updateGroupCoordinate(graphicModel, targetGraphicModels, editRequestMap);
      }
    });

    if (isGroup(parentGroup) === true) {
      this.updateGroupCoordinateCore(parentGroup, childGraphicModelList, editRequestMap);
    }
  }

  private updateGroupCoordinateCore(
    parentGroup: GraphicModel,
    childGraphicModelList: GraphicModel[],
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ): void {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    childGraphicModelList.forEach(graphicModel => {
      const coordinateInfo =
        editRequestMap.get(graphicModel)?.getCurrentEditingCoordinateInfo() ??
        graphicModel.getCoordinateInfo();

      const x = coordinateInfo.getX();
      const y = coordinateInfo.getY();
      const width = coordinateInfo.getWidth();
      const height = coordinateInfo.getHeight();

      const rotationDegree = coordinateInfo.getRotation();

      let childMinX: number;
      let childMinY: number;
      let childMaxX: number;
      let childMaxY: number;

      if (isWHSwitched(rotationDegree) === true) {
        const childCenterX = x + width / 2;
        const childCenterY = y + height / 2;

        childMinX = childCenterX - height / 2;
        childMinY = childCenterY - width / 2;
        childMaxX = childCenterX + height / 2;
        childMaxY = childCenterY + width / 2;
      } else {
        childMinX = x;
        childMinY = y;
        childMaxX = x + width;
        childMaxY = y + height;
      }

      minX = Math.min(minX, childMinX);
      minY = Math.min(minY, childMinY);
      maxX = Math.max(maxX, childMaxX);
      maxY = Math.max(maxY, childMaxY);
    });

    const editRequest = editRequestMap.get(parentGroup) ?? new GraphicModelEditRequest(parentGroup);

    if (editRequestMap.has(parentGroup) === false) {
      editRequestMap.set(parentGroup, editRequest);
    }

    const coordinateInfo = editRequest.getCurrentEditingCoordinateInfo();
    const newGroupX = minX;
    const newGroupY = minY;
    const newGroupW = maxX - minX;
    const newGroupH = maxY - minY;
    const newW = (newGroupW * coordinateInfo.getWidth()) / (coordinateInfo.getGroupWidth() ?? 1);
    const newH = (newGroupH * coordinateInfo.getHeight()) / (coordinateInfo.getGroupHeight() ?? 1);

    const tmpCoordinateInfo = new CoordinateInfo();

    tmpCoordinateInfo.setX(coordinateInfo.getX());
    tmpCoordinateInfo.setY(coordinateInfo.getY());
    tmpCoordinateInfo.setWidth(newW);
    tmpCoordinateInfo.setHeight(newH);

    tmpCoordinateInfo.setFlipH(coordinateInfo.getFlipH());
    tmpCoordinateInfo.setFlipV(coordinateInfo.getFlipV());
    tmpCoordinateInfo.setRotation(coordinateInfo.getRotation());

    tmpCoordinateInfo.setGroupX(newGroupX);
    tmpCoordinateInfo.setGroupY(newGroupY);
    tmpCoordinateInfo.setGroupWidth(newGroupW);
    tmpCoordinateInfo.setGroupHeight(newGroupH);

    const newGroupPosition = this.getNewGroupPosition(
      parentGroup,
      tmpCoordinateInfo,
      editRequestMap
    );

    coordinateInfo.setX(newGroupPosition.x);
    coordinateInfo.setY(newGroupPosition.y);
    coordinateInfo.setWidth(newW);
    coordinateInfo.setHeight(newH);

    coordinateInfo.setGroupX(newGroupX);
    coordinateInfo.setGroupY(newGroupY);
    coordinateInfo.setGroupWidth(newGroupW);
    coordinateInfo.setGroupHeight(newGroupH);
  }

  private getNewGroupPosition(
    targetGroup: GraphicModel,
    tmpCoordinateInfo: CoordinateInfo,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ): { x: number; y: number } {
    const targetGroupEditRequest =
      editRequestMap.get(targetGroup) ?? new GraphicModelEditRequest(targetGroup);

    if (editRequestMap.has(targetGroup) === false) {
      editRequestMap.set(targetGroup, targetGroupEditRequest);
    }

    const currentEditingCoordinateInfoList = this.getParentCoordinateInfoList(
      targetGroup,
      editRequestMap
    );
    const currentEditingCoordinateInfo = targetGroupEditRequest.getCurrentEditingCoordinateInfo();

    const initialEditingAccumulatedTotalMatrix = getAccumulatedTransformMatrix([
      currentEditingCoordinateInfo,
      ...currentEditingCoordinateInfoList,
    ]);

    const currentEditingAccumulatedParentMatrix = getAccumulatedTransformMatrix(
      currentEditingCoordinateInfoList
    );
    const currentEditingAccumulatedTotalMatrix = getAccumulatedTransformMatrix([
      tmpCoordinateInfo,
      ...currentEditingCoordinateInfoList,
    ]);

    const { currentPosition, currentSize } = this.getCurrentTransform(
      tmpCoordinateInfo,
      currentEditingCoordinateInfoList,
      currentEditingAccumulatedParentMatrix
    );

    const inverseOfCurrentEditingTranslateMatrix = math.inv(
      math.matrix([
        [1, 0, currentPosition.x],
        [0, 1, currentPosition.y],
        [0, 0, 1],
      ])
    );

    // rfts 행렬을 풀면
    // t X 나머지 행렬 꼴임
    const currentEditingAccumulatedTotalMatrixWithoutTranslation = math.multiply(
      inverseOfCurrentEditingTranslateMatrix,
      currentEditingAccumulatedTotalMatrix
    );
    const newAccumulatedTranslationMatrix = math.multiply(
      initialEditingAccumulatedTotalMatrix,
      math.inv(currentEditingAccumulatedTotalMatrixWithoutTranslation)
    );
    const newAccumulatedCenterMatrix = math.matrix([
      [1, 0, Number(newAccumulatedTranslationMatrix.get([0, 2])) + currentSize.width / 2],
      [0, 1, Number(newAccumulatedTranslationMatrix.get([1, 2])) + currentSize.height / 2],
      [0, 0, 1],
    ]);
    const newCenterMatrix = math.multiply(
      math.inv(currentEditingAccumulatedParentMatrix),
      newAccumulatedCenterMatrix
    );

    return {
      x: Number(newCenterMatrix.get([0, 2]) - tmpCoordinateInfo.getWidth() / 2),
      y: Number(newCenterMatrix.get([1, 2]) - tmpCoordinateInfo.getHeight() / 2),
    };
  }

  private getParentCoordinateInfoList(
    graphicModel: GraphicModel,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ): CoordinateInfo[] {
    const currentEditingCoordinateInfoList = new Array<CoordinateInfo>();

    let tmpParent = graphicModel.getParent();

    while (isGraphicModel(tmpParent) && isGroup(tmpParent) === true) {
      const parentGraphicModel = tmpParent as GraphicModel;
      const editRequest = editRequestMap.get(parentGraphicModel);

      currentEditingCoordinateInfoList.push(
        editRequest?.getCurrentEditingCoordinateInfo() ?? parentGraphicModel.getCoordinateInfo()
      );

      tmpParent = tmpParent.getParent();
    }

    return currentEditingCoordinateInfoList;
  }

  private getCurrentTransform(
    targetCoordinateInfo: CoordinateInfo,
    parentCoordinateInfoList: CoordinateInfo[],
    parentAccumulatedMatrix: math.Matrix
  ): { currentPosition: IPoint; currentSize: ISize } {
    const currentSize = {
      width: targetCoordinateInfo.getWidth(),
      height: targetCoordinateInfo.getHeight(),
    };

    let accumulatedRotation = targetCoordinateInfo.getRotation();

    parentCoordinateInfoList.forEach(coordinateInfo => {
      const groupWidth = coordinateInfo.getGroupWidth();
      const groupHeight = coordinateInfo.getGroupHeight();
      const widthRatio = groupWidth ? coordinateInfo.getWidth() / groupWidth : 1;
      const heightRatio = groupHeight ? coordinateInfo.getHeight() / groupHeight : 1;

      if (isWHSwitched(accumulatedRotation) === true) {
        currentSize.width *= heightRatio;
        currentSize.height *= widthRatio;
      } else {
        currentSize.width *= widthRatio;
        currentSize.height *= heightRatio;
      }

      const parentFlipH = coordinateInfo.getFlipH();
      const parentFlipV = coordinateInfo.getFlipV();

      if (parentFlipH !== parentFlipV) {
        accumulatedRotation = 360 - accumulatedRotation;
      }

      accumulatedRotation += coordinateInfo.getRotation();
    });

    const centerPointMatrix = math.matrix([
      [1, 0, targetCoordinateInfo.getX() + targetCoordinateInfo.getWidth() / 2],
      [0, 1, targetCoordinateInfo.getY() + targetCoordinateInfo.getHeight() / 2],
      [0, 0, 1],
    ]);

    const currentCenterPointMatrix = math.multiply(parentAccumulatedMatrix, centerPointMatrix);

    return {
      currentPosition: {
        x: Number(currentCenterPointMatrix.get([0, 2])) - currentSize.width / 2,
        y: Number(currentCenterPointMatrix.get([1, 2])) - currentSize.height / 2,
      },
      currentSize,
    };
  }

  private applyEditRequest(
    ctx: AppContext,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ) {
    editRequestMap.forEach((editRequest, graphicModel) => {
      const oldCoordinateInfo = graphicModel.getCoordinateInfo();
      const newCoordinateInfo = editRequest.getCurrentEditingCoordinateInfo().clone();

      const command = new SetGraphicAttributeCommand(
        graphicModel,
        oldCoordinateInfo,
        newCoordinateInfo,
        graphicModel.setCoordinateInfo
      );
      ctx.getEditableContext().getCommandController()?.appendSimpleCommand(command);
    });
  }

  private clearGraphicModelInsertContext(ctx: AppContext): void {
    clearGraphicEditContext(ctx);
  }
}
