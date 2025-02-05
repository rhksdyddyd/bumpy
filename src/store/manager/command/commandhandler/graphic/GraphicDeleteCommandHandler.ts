import * as math from 'mathjs';
import { CommandEnum } from 'types/store/command/CommandEnum';
import AppContext from 'store/context/AppContext';
import { ICommandHandlerResponse } from 'types/store/command/CommandTypes';
import GraphicModel from 'model/node/graphic/GraphicModel';
import { updateNewSelectionContainer } from 'util/node/graphic/edit/GraphicModelEditingUtil';
import { getRootGroup, isGroup, isGroupChild } from 'util/node/graphic/GraphicModelTreeNodeUtil';
import TreeNode from 'model/node/TreeNode';
import GraphicModelEditRequest from 'store/container/edit/GraphicModelEditRequest';
import { isWHSwitched } from 'util/coordinate/CoordinateUtil';
import CoordinateInfo from 'model/node/graphic/info/CoordinateInfo';
import {
  getAccumulatedTransformMatrix,
  getNoneEditingDisplayedCenterCoordinate,
  getNoneEditingDisplayedFlipH,
  getNoneEditingDisplayedFlipV,
  getNoneEditingDisplayedPosition,
  getNoneEditingDisplayedRotation,
  getNoneEditingDisplayedSize,
  getTransformMatrix,
} from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';
import { isGraphicModel } from 'util/node/TreeNodeTypeGuards';
import CommandHandler from '../CommandHandler';
import RemoveTreeNodeCommand from '../../simplecommand/node/RemoveTreeNodeCommand';
import MoveTreeNodeCommand from '../../simplecommand/node/MoveTreeNodeCommand';
import SetGraphicAttributeCommand from '../../simplecommand/node/graphic/SetGraphicAttributeCommand';
import RequestRerenderTreeNodeComponentCommand from '../../simplecommand/rerender/RequestRerenderTreeNodeComponentCommand';

export interface IDeleteGraphicCommandProps {
  commandId: CommandEnum.DELETE_GRAPHIC;
}

export default class GraphicDeleteCommandHandler extends CommandHandler {
  public processCommand(
    ctx: AppContext,
    commandProps: IDeleteGraphicCommandProps
  ): ICommandHandlerResponse {
    switch (commandProps.commandId) {
      case CommandEnum.DELETE_GRAPHIC: {
        this.deleteGraphic(ctx);
        break;
      }
      default: {
        break;
      }
    }
    return { isValid: true, terminate: true };
  }

  private deleteGraphic(ctx: AppContext): void {
    const editableContext = ctx.getEditableContext();
    const selectionContainer = editableContext.getSelectionContainer();

    const selectedGraphicModels = selectionContainer
      .getGraphicModelSelectionContainer()
      .getSelectedGraphicModels();

    const deletedGraphicModelList = new Array<GraphicModel>();

    selectedGraphicModels?.reverse().forEach((graphicModel: GraphicModel) => {
      const parentModel = graphicModel.getParent();
      if (parentModel !== undefined) {
        this.removeNodeAndAllChild(ctx, graphicModel);
        if (isGroupChild(graphicModel) === true) {
          deletedGraphicModelList.push(graphicModel);
        }
      }
    });

    this.updateParentGroup(ctx, deletedGraphicModelList);

    updateNewSelectionContainer(ctx, []);
  }

  private updateParentGroup(ctx: AppContext, deletedGraphicModelList: GraphicModel[]) {
    const deletedGraphicModelSet = new Set<GraphicModel>(deletedGraphicModelList);
    const editRequestMap = new Map<GraphicModel, GraphicModelEditRequest>();

    const rootGroupSet = new Set<GraphicModel>();

    deletedGraphicModelList.forEach(graphicModel => {
      const parentGroup = graphicModel.getParent();
      if (isGraphicModel(parentGroup) && isGroup(parentGroup) === true) {
        this.unGroupChild(ctx, parentGroup, deletedGraphicModelSet, editRequestMap);

        const rootGroup = getRootGroup(parentGroup);
        if (rootGroup !== undefined) {
          rootGroupSet.add(rootGroup);
        }
      }
    });

    rootGroupSet.forEach(rootGroup => {
      this.updateGroupCoordinate(rootGroup, deletedGraphicModelSet, editRequestMap);
    });

    this.applyEditRequest(ctx, editRequestMap);
  }

  private updateGroupCoordinate(
    parentGroup: GraphicModel,
    deletedGraphicModelSet: Set<GraphicModel>,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ) {
    const childGraphicModelList = this.getChildGraphicModelList(
      parentGroup,
      deletedGraphicModelSet
    );

    childGraphicModelList.forEach(graphicModel => {
      if (isGroup(graphicModel) === true) {
        this.updateGroupCoordinate(graphicModel, deletedGraphicModelSet, editRequestMap);
      }
    });

    if (isGroup(parentGroup) === true && deletedGraphicModelSet.has(parentGroup) === false) {
      this.updateGroupCoordinateCore(
        parentGroup,
        childGraphicModelList,
        deletedGraphicModelSet,
        editRequestMap
      );
    }
  }

  private updateGroupCoordinateCore(
    parentGroup: GraphicModel,
    childGraphicModelList: GraphicModel[],
    deletedGraphicModelSet: Set<GraphicModel>,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    childGraphicModelList.forEach(childGraphicModel => {
      const childCoordInfo =
        editRequestMap.get(childGraphicModel)?.getCurrentEditingCoordinateInfo() ??
        childGraphicModel.getCoordinateInfo();

      if (childCoordInfo !== undefined) {
        let childMinX: number;
        let childMinY: number;
        let childMaxX: number;
        let childMaxY: number;

        if (isWHSwitched(childCoordInfo.getRotation()) === true) {
          const centerX = childCoordInfo.getX() + childCoordInfo.getWidth() / 2;
          const centerY = childCoordInfo.getY() + childCoordInfo.getHeight() / 2;

          childMinX = centerX - childCoordInfo.getHeight() / 2;
          childMinY = centerY - childCoordInfo.getWidth() / 2;
          childMaxX = centerX + childCoordInfo.getHeight() / 2;
          childMaxY = centerY + childCoordInfo.getWidth() / 2;
        } else {
          childMinX = childCoordInfo.getX();
          childMinY = childCoordInfo.getY();
          childMaxX = childCoordInfo.getX() + childCoordInfo.getWidth();
          childMaxY = childCoordInfo.getY() + childCoordInfo.getHeight();
        }

        minX = math.min(minX, childMinX);
        minY = math.min(minY, childMinY);
        maxX = math.max(maxX, childMaxX);
        maxY = math.max(maxY, childMaxY);
      }
    });

    const parentEditRequest =
      editRequestMap.get(parentGroup) ?? new GraphicModelEditRequest(parentGroup);

    if (editRequestMap.has(parentGroup) === false) {
      editRequestMap.set(parentGroup, parentEditRequest);
    }

    const parentCurrentCoordInfo = parentEditRequest.getCurrentEditingCoordinateInfo();

    const newGroupX = minX;
    const newGroupY = minY;
    const newGroupWidth = maxX - minX;
    const newGroupHeight = maxY - minY;

    const newWidth =
      (newGroupWidth * parentCurrentCoordInfo.getWidth()) /
      (parentCurrentCoordInfo.getGroupWidth() ?? 1);
    const newHeight =
      (newGroupHeight * parentCurrentCoordInfo.getHeight()) /
      (parentCurrentCoordInfo.getGroupHeight() ?? 1);

    const tmpCoordinateInfo = new CoordinateInfo();

    tmpCoordinateInfo.setX(parentCurrentCoordInfo.getX());
    tmpCoordinateInfo.setY(parentCurrentCoordInfo.getY());
    tmpCoordinateInfo.setWidth(newWidth);
    tmpCoordinateInfo.setHeight(newHeight);

    tmpCoordinateInfo.setFlipH(parentCurrentCoordInfo.getFlipH());
    tmpCoordinateInfo.setFlipV(parentCurrentCoordInfo.getFlipV());
    tmpCoordinateInfo.setRotation(parentCurrentCoordInfo.getRotation());

    tmpCoordinateInfo.setGroupX(newGroupX);
    tmpCoordinateInfo.setGroupY(newGroupY);
    tmpCoordinateInfo.setGroupWidth(newGroupWidth);
    tmpCoordinateInfo.setGroupHeight(newGroupHeight);

    const newGroupPosition = this.getNewGroupPosition(
      parentGroup,
      tmpCoordinateInfo,
      deletedGraphicModelSet,
      editRequestMap
    );

    parentCurrentCoordInfo.setX(newGroupPosition.x);
    parentCurrentCoordInfo.setY(newGroupPosition.y);
    parentCurrentCoordInfo.setWidth(newWidth);
    parentCurrentCoordInfo.setHeight(newHeight);

    parentCurrentCoordInfo.setGroupX(newGroupX);
    parentCurrentCoordInfo.setGroupY(newGroupY);
    parentCurrentCoordInfo.setGroupWidth(newGroupWidth);
    parentCurrentCoordInfo.setGroupHeight(newGroupHeight);
  }

  private getNewGroupPosition(
    targetGroup: GraphicModel,
    tmpCoordinateInfo: CoordinateInfo,
    deletedGraphicModelSet: Set<GraphicModel>,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ): { x: number; y: number } {
    const targetGroupEditRequest =
      editRequestMap.get(targetGroup) ?? new GraphicModelEditRequest(targetGroup);

    if (editRequestMap.has(targetGroup) === false) {
      editRequestMap.set(targetGroup, targetGroupEditRequest);
    }

    const currentEditingCoordinateInfoList = this.getParentCoordinateInfoList(
      targetGroup,
      deletedGraphicModelSet,
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

  private unGroupChild(
    ctx: AppContext,
    parentGroup: GraphicModel,
    deletedGraphicModelSet: Set<GraphicModel>,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ) {
    if (isGroup(parentGroup) === true && deletedGraphicModelSet.has(parentGroup) === false) {
      const childGraphicModelList = this.getChildGraphicModelList(
        parentGroup,
        deletedGraphicModelSet
      );

      if (childGraphicModelList.length < 2) {
        const newParent = this.getNewParent(parentGroup, deletedGraphicModelSet);

        if (newParent !== undefined) {
          deletedGraphicModelSet.add(parentGroup);

          // node tree 재구성
          childGraphicModelList.forEach(childGraphicModel => {
            this.moveNode(
              ctx,
              childGraphicModel,
              newParent,
              this.getNewNextSibling(parentGroup, deletedGraphicModelSet)
            );
          });
          this.removeNode(ctx, parentGroup);

          this.applyUnGroupTransform(
            parentGroup,
            newParent,
            childGraphicModelList,
            deletedGraphicModelSet,
            editRequestMap
          );

          editRequestMap.delete(parentGroup);

          if (isGraphicModel(newParent) && isGroup(newParent)) {
            this.unGroupChild(ctx, newParent, deletedGraphicModelSet, editRequestMap);
          }
        }
      }
    }
  }

  private applyUnGroupTransform(
    oldParent: GraphicModel,
    newParent: TreeNode,
    childGraphicModelList: GraphicModel[],
    deletedGraphicModelSet: Set<GraphicModel>,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ) {
    let newParentTransformationMatrix = math.identity(3, 3) as math.Matrix;

    if (isGraphicModel(newParent) && isGroup(newParent) === true) {
      const newParentGraphicModel = newParent;
      const currentEditingCoordinateInfoList = this.getParentCoordinateInfoList(
        newParentGraphicModel,
        deletedGraphicModelSet,
        editRequestMap
      );

      newParentTransformationMatrix = getAccumulatedTransformMatrix([
        editRequestMap.get(newParentGraphicModel)?.getCurrentEditingCoordinateInfo() ??
          newParentGraphicModel.getCoordinateInfo(),
        ...currentEditingCoordinateInfoList,
      ]);
    }

    const flipHList = new Array<boolean>();
    const flipVList = new Array<boolean>();
    const rotationList = new Array<number>();
    const wRatioList = new Array<number>();
    const hRatioList = new Array<number>();

    let tmpTreeNode: Nullable<TreeNode> = newParent;

    while (isGraphicModel(tmpTreeNode) && isGroup(tmpTreeNode) === true) {
      const tmpGraphicModel = tmpTreeNode;
      if (tmpGraphicModel !== undefined) {
        const tmpCoordinateInfo =
          editRequestMap.get(tmpGraphicModel)?.getCurrentEditingCoordinateInfo() ??
          tmpGraphicModel.getCoordinateInfo();

        flipHList.push(tmpCoordinateInfo.getFlipH());
        flipVList.push(tmpCoordinateInfo.getFlipV());
        rotationList.push(tmpCoordinateInfo.getRotation());
        wRatioList.push(tmpCoordinateInfo.getWidth() / (tmpCoordinateInfo.getGroupWidth() ?? 1));
        hRatioList.push(tmpCoordinateInfo.getHeight() / (tmpCoordinateInfo.getGroupHeight() ?? 1));
      }

      tmpTreeNode = this.getNewParent(tmpTreeNode, deletedGraphicModelSet);
    }

    flipHList.reverse();
    flipVList.reverse();
    rotationList.reverse();
    wRatioList.reverse();
    hRatioList.reverse();

    childGraphicModelList.forEach(childGraphicModel => {
      this.applyUnGroupTransformOneDepthChild(
        childGraphicModel,
        oldParent,
        newParentTransformationMatrix,
        flipHList,
        flipVList,
        rotationList,
        wRatioList,
        hRatioList,
        editRequestMap
      );

      if (isGroup(childGraphicModel) === true) {
        const coordinateInfo =
          editRequestMap.get(childGraphicModel)?.getCurrentEditingCoordinateInfo() ??
          childGraphicModel.getCoordinateInfo();

        flipHList.push(coordinateInfo.getFlipH());
        flipVList.push(coordinateInfo.getFlipV());
        rotationList.push(coordinateInfo.getRotation());
        wRatioList.push(coordinateInfo.getWidth() / (coordinateInfo.getGroupWidth() ?? 1));
        hRatioList.push(coordinateInfo.getHeight() / (coordinateInfo.getGroupHeight() ?? 1));

        const childDisplayedPosition = getNoneEditingDisplayedPosition(childGraphicModel);
        const childDisplayedSize = getNoneEditingDisplayedSize(childGraphicModel);

        // newTransformationMatrix는
        // getNoneEditingAccumulatedTransformationMatrix 함수로 얻는 matrix와 같음
        // 하지만 depth에 따라 아래의 방식으로 직접 계산하는 것이 효율적임
        const newTransformationMatrix는 = getTransformMatrix(
          coordinateInfo,
          childDisplayedPosition.x,
          childDisplayedPosition.y,
          childDisplayedSize.width,
          childDisplayedSize.height,
          getNoneEditingDisplayedFlipH(childGraphicModel),
          getNoneEditingDisplayedFlipV(childGraphicModel),
          getNoneEditingDisplayedRotation(childGraphicModel)
        );

        this.applyUnGroupTransformRecursively(
          childGraphicModel,
          newTransformationMatrix는,
          flipHList,
          flipVList,
          rotationList,
          wRatioList,
          hRatioList,
          deletedGraphicModelSet,
          editRequestMap
        );

        flipHList.pop();
        flipVList.pop();
        rotationList.pop();
        wRatioList.pop();
        hRatioList.pop();
      }
    });
  }

  private applyUnGroupTransformOneDepthChild(
    childGraphicModel: GraphicModel,
    oldParent: GraphicModel,
    parentTransformationMatrix: math.Matrix,
    flipHList: boolean[],
    flipVList: boolean[],
    rotationList: number[],
    wRatioList: number[],
    hRatioList: number[],
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ) {
    const editRequest =
      editRequestMap.get(childGraphicModel) ?? new GraphicModelEditRequest(childGraphicModel);

    if (editRequestMap.has(childGraphicModel) === false) {
      editRequestMap.set(childGraphicModel, editRequest);
    }

    const parentCoordinateInfo =
      editRequestMap.get(oldParent)?.getCurrentEditingCoordinateInfo() ??
      oldParent.getCoordinateInfo();
    const childCoordinateInfo = editRequest.getCurrentEditingCoordinateInfo();

    let newRotation = childCoordinateInfo.getRotation();

    if (parentCoordinateInfo.getFlipH() !== parentCoordinateInfo.getFlipV()) {
      newRotation = 360 - newRotation;
    }

    newRotation += parentCoordinateInfo.getRotation();

    let accumulatedWRatio = 1;
    let accumulatedHRatio = 1;
    let accumulatedRotation = newRotation;

    const listSize = flipHList.length;

    for (let index = 0; index < listSize; index += 1) {
      const parentFlipH = flipHList[listSize - 1 - index];
      const parentFlipV = flipVList[listSize - 1 - index];
      const parentRotation = rotationList[listSize - 1 - index];
      const parentWRatio = wRatioList[listSize - 1 - index];
      const parentHRatio = hRatioList[listSize - 1 - index];

      if (isWHSwitched(accumulatedRotation) === true) {
        accumulatedWRatio *= parentHRatio;
        accumulatedHRatio *= parentWRatio;
      } else {
        accumulatedWRatio *= parentWRatio;
        accumulatedHRatio *= parentHRatio;
      }

      if (parentFlipH !== parentFlipV) {
        accumulatedRotation = 360 - accumulatedRotation;
      }

      accumulatedRotation += parentRotation;
    }

    const displayedSize = getNoneEditingDisplayedSize(childGraphicModel);

    const newWidth = displayedSize.width / accumulatedWRatio;
    const newHeight = displayedSize.height / accumulatedHRatio;

    const displayedCenterCoordinate = getNoneEditingDisplayedCenterCoordinate(childGraphicModel);

    const newCenterCoordinate = math.multiply(
      math.inv(parentTransformationMatrix),
      math.matrix([[displayedCenterCoordinate.x], [displayedCenterCoordinate.y], [1]])
    );

    const newX = Number(newCenterCoordinate.get([0, 0])) - newWidth / 2;
    const newY = Number(newCenterCoordinate.get([1, 0])) - newHeight / 2;

    const newFlipH = childCoordinateInfo.getFlipH() !== parentCoordinateInfo.getFlipH();
    const newFlipV = childCoordinateInfo.getFlipV() !== parentCoordinateInfo.getFlipV();

    childCoordinateInfo.setX(newX);
    childCoordinateInfo.setY(newY);
    childCoordinateInfo.setWidth(newWidth);
    childCoordinateInfo.setHeight(newHeight);
    childCoordinateInfo.setRotation(newRotation);
    childCoordinateInfo.setFlipH(newFlipH);
    childCoordinateInfo.setFlipV(newFlipV);
  }

  private applyUnGroupTransformRecursively(
    parentGroup: GraphicModel,
    parentTransformationMatrix: math.Matrix,
    flipHList: boolean[],
    flipVList: boolean[],
    rotationList: number[],
    wRatioList: number[],
    hRatioList: number[],
    deletedGraphicModelSet: Set<GraphicModel>,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ) {
    if (isGroup(parentGroup) === true) {
      const childGraphicModelList = this.getChildGraphicModelList(
        parentGroup,
        deletedGraphicModelSet
      );

      childGraphicModelList.forEach(child => {
        if (isGraphicModel(child)) {
          const childGraphicModel = child;

          const editRequest =
            editRequestMap.get(childGraphicModel) ?? new GraphicModelEditRequest(childGraphicModel);

          if (editRequestMap.has(childGraphicModel) === false) {
            editRequestMap.set(childGraphicModel, editRequest);
          }

          const childCoordinateInfo = editRequest.getCurrentEditingCoordinateInfo();

          let accumulatedWRatio = 1;
          let accumulatedHRatio = 1;
          let accumulatedRotation = childCoordinateInfo.getRotation();

          const listSize = flipHList.length;

          for (let index = 0; index < listSize; index += 1) {
            const parentFlipH = flipHList[listSize - 1 - index];
            const parentFlipV = flipVList[listSize - 1 - index];
            const parentRotation = rotationList[listSize - 1 - index];
            const parentWRatio = wRatioList[listSize - 1 - index];
            const parentHRatio = hRatioList[listSize - 1 - index];

            if (isWHSwitched(accumulatedRotation) === true) {
              accumulatedWRatio *= parentHRatio;
              accumulatedHRatio *= parentWRatio;
            } else {
              accumulatedWRatio *= parentWRatio;
              accumulatedHRatio *= parentHRatio;
            }

            if (parentFlipH !== parentFlipV) {
              accumulatedRotation = 360 - accumulatedRotation;
            }

            accumulatedRotation += parentRotation;
          }

          const displayedSize = getNoneEditingDisplayedSize(childGraphicModel);

          const newWidth = displayedSize.width / accumulatedWRatio;
          const newHeight = displayedSize.height / accumulatedHRatio;

          const displayedCenterCoordinate =
            getNoneEditingDisplayedCenterCoordinate(childGraphicModel);

          const newCenterCoordinate = math.multiply(
            math.inv(parentTransformationMatrix),
            math.matrix([[displayedCenterCoordinate.x], [displayedCenterCoordinate.y], [1]])
          );

          const newX = Number(newCenterCoordinate.get([0, 0])) - newWidth / 2;
          const newY = Number(newCenterCoordinate.get([1, 0])) - newHeight / 2;

          childCoordinateInfo.setX(newX);
          childCoordinateInfo.setY(newY);
          childCoordinateInfo.setWidth(newWidth);
          childCoordinateInfo.setHeight(newHeight);

          if (isGroup(childGraphicModel) === true) {
            const displayedPosition = {
              x: displayedCenterCoordinate.x - displayedSize.width / 2,
              y: displayedCenterCoordinate.y - displayedSize.height / 2,
            };

            const newTransformationMatrix = getTransformMatrix(
              childCoordinateInfo,
              displayedPosition.x,
              displayedPosition.y,
              displayedSize.width,
              displayedSize.height,
              getNoneEditingDisplayedFlipH(childGraphicModel),
              getNoneEditingDisplayedFlipV(childGraphicModel),
              getNoneEditingDisplayedRotation(childGraphicModel)
            );

            flipHList.push(childCoordinateInfo.getFlipH());
            flipVList.push(childCoordinateInfo.getFlipV());
            rotationList.push(childCoordinateInfo.getRotation());
            wRatioList.push(newWidth / (childCoordinateInfo.getGroupWidth() ?? 1));
            hRatioList.push(newHeight / (childCoordinateInfo.getGroupHeight() ?? 1));

            this.applyUnGroupTransformRecursively(
              childGraphicModel,
              newTransformationMatrix,
              flipHList,
              flipVList,
              rotationList,
              wRatioList,
              hRatioList,
              deletedGraphicModelSet,
              editRequestMap
            );

            flipHList.pop();
            flipVList.pop();
            rotationList.pop();
            wRatioList.pop();
            hRatioList.pop();
          }
        }
      });
    }
  }

  private getCurrentTransform(
    targetCoordinateInfo: CoordinateInfo,
    parentCoordinateInfoList: CoordinateInfo[],
    parentAccumulatedMatrix: math.Matrix
  ): { currentPosition: { x: number; y: number }; currentSize: { width: number; height: number } } {
    const currentSize = {
      width: targetCoordinateInfo.getWidth(),
      height: targetCoordinateInfo.getHeight(),
    };

    let accumulatedRotation = targetCoordinateInfo.getRotation();

    parentCoordinateInfoList.forEach(coordinateInfo => {
      if (isWHSwitched(accumulatedRotation) === true) {
        currentSize.width *= coordinateInfo.getHeight() / (coordinateInfo.getGroupHeight() ?? 1);
        currentSize.height *= coordinateInfo.getWidth() / (coordinateInfo.getGroupWidth() ?? 1);
      } else {
        currentSize.width *= coordinateInfo.getWidth() / (coordinateInfo.getGroupWidth() ?? 1);
        currentSize.height *= coordinateInfo.getHeight() / (coordinateInfo.getGroupHeight() ?? 1);
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
    const commandController = ctx.getEditableContext().getCommandController();

    if (commandController !== undefined) {
      editRequestMap.forEach((editRequest, graphicModel) => {
        const oldCoordinateInfo = graphicModel.getCoordinateInfo();
        const newCoordinateInfo = editRequest.getCurrentEditingCoordinateInfo().clone();

        const setCoordinateInfoCommand = new SetGraphicAttributeCommand(
          graphicModel,
          oldCoordinateInfo,
          newCoordinateInfo,
          graphicModel.setCoordinateInfo
        );
        commandController.appendSimpleCommand(setCoordinateInfoCommand);

        const requestRerenderCommand = new RequestRerenderTreeNodeComponentCommand(
          ctx,
          graphicModel,
          true,
          true
        );
        commandController.appendPostSimpleCommand(requestRerenderCommand);
      });
    }
  }

  private removeNodeAndAllChild(ctx: AppContext, node: TreeNode): void {
    const parent = node.getParent();
    if (parent === undefined) {
      return;
    }

    this.removeChildNode(ctx, node);
    this.removeNode(ctx, node);
  }

  private removeChildNode(ctx: AppContext, parentNode: TreeNode): void {
    for (
      let child = parentNode.getLastChild();
      child !== undefined;
      child = child.getPrevSibling()
    ) {
      if (child.getFirstChild() !== undefined) {
        this.removeChildNode(ctx, child);
      }
      this.removeNode(ctx, child);
    }
  }

  private removeNode(ctx: AppContext, targetNode: TreeNode): boolean {
    const parent = targetNode.getParent();

    if (parent === undefined) {
      return false;
    }

    const commandController = ctx.getEditableContext().getCommandController();
    const removeNodeCommand = new RemoveTreeNodeCommand(targetNode);
    commandController?.appendSimpleCommand(removeNodeCommand);
    const requestRerenderCommand = new RequestRerenderTreeNodeComponentCommand(
      ctx,
      parent,
      true,
      true
    );
    commandController?.appendSimpleCommand(requestRerenderCommand);

    return true;
  }

  private moveNode(
    ctx: AppContext,
    target: TreeNode,
    newParent: TreeNode,
    newNext?: TreeNode
  ): void {
    const commandController = ctx.getEditableContext().getCommandController();

    const moveTreeNodeCommand = new MoveTreeNodeCommand(target, newParent, newNext);
    commandController?.appendSimpleCommand(moveTreeNodeCommand);

    const oldParent = target.getParent();
    if (oldParent !== undefined) {
      const requestRerenderOldParentCommand = new RequestRerenderTreeNodeComponentCommand(
        ctx,
        oldParent,
        true,
        true
      );
      commandController?.appendSimpleCommand(requestRerenderOldParentCommand);
    }

    const requestRerenderNewParentCommand = new RequestRerenderTreeNodeComponentCommand(
      ctx,
      newParent,
      true,
      true
    );
    commandController?.appendSimpleCommand(requestRerenderNewParentCommand);
  }

  private getChildGraphicModelList(
    parentGroup: GraphicModel,
    deletedGraphicModelSet: Set<GraphicModel>
  ): GraphicModel[] {
    const childGraphicModelList = new Array<GraphicModel>();

    parentGroup.forEachChild(child => {
      if (isGraphicModel(child)) {
        const childGraphicModel = child;

        if (deletedGraphicModelSet.has(childGraphicModel) === false) {
          childGraphicModelList.push(childGraphicModel);
        } else if (isGroup(childGraphicModel) === true) {
          childGraphicModelList.push(
            ...this.getChildGraphicModelList(childGraphicModel, deletedGraphicModelSet)
          );
        }
      }
    });

    return childGraphicModelList;
  }

  private getNewParent(
    currentParent: TreeNode,
    deletedGraphicModelSet: Set<GraphicModel>
  ): Nullable<TreeNode> {
    let newParent = currentParent.getParent();

    while (newParent !== undefined) {
      if (isGraphicModel(newParent) && deletedGraphicModelSet.has(newParent) === true) {
        newParent = newParent.getParent();
      } else {
        break;
      }
    }

    return newParent;
  }

  private getNewNextSibling(
    currentParent: TreeNode,
    deletedGraphicModelSet: Set<GraphicModel>
  ): Nullable<TreeNode> {
    let newNextSibling = currentParent.getNextSibling();

    while (newNextSibling !== undefined) {
      if (isGraphicModel(newNextSibling) && deletedGraphicModelSet.has(newNextSibling) === true) {
        newNextSibling = newNextSibling.getNextSibling();
      } else {
        break;
      }
    }

    return newNextSibling;
  }

  private getParentCoordinateInfoList(
    graphicModel: GraphicModel,
    deletedGraphicModelSet: Set<GraphicModel>,
    editRequestMap: Map<GraphicModel, GraphicModelEditRequest>
  ): CoordinateInfo[] {
    const currentEditingCoordinateInfoList = new Array<CoordinateInfo>();

    if (deletedGraphicModelSet.has(graphicModel) === false) {
      let tmpParent = graphicModel.getParent();

      while (isGraphicModel(tmpParent) && isGroup(tmpParent) === true) {
        const parentGraphicModel = tmpParent;
        const editRequest = editRequestMap.get(parentGraphicModel);

        if (deletedGraphicModelSet.has(parentGraphicModel) === false) {
          currentEditingCoordinateInfoList.push(
            editRequest?.getCurrentEditingCoordinateInfo() ?? parentGraphicModel.getCoordinateInfo()
          );
        }

        tmpParent = tmpParent.getParent();
      }
    }

    return currentEditingCoordinateInfoList;
  }
}
