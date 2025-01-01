import * as math from 'mathjs';
import { CommandEnum } from 'types/store/command/CommandEnum';
import AppContext from 'store/context/AppContext';
import { ICommandHandlerResponse } from 'types/store/command/CommandTypes';
import { getRootGroup, isGroup, isGroupChild } from 'util/node/graphic/GraphicModelTreeNodeUtil';
import { isGraphicModel } from 'util/node/TreeNodeTypeGuards';
import GraphicModel from 'model/node/graphic/GraphicModel';
import TreeNode from 'model/node/TreeNode';
import { createGraphicModelForGroupObject } from 'util/node/graphic/GraphicModelCreateUtil';
import { isWHSwitched } from 'util/coordinate/CoordinateUtil';
import { updateNewSelectionContainer } from 'util/node/graphic/edit/GraphicModelEditingUtil';
import {
  getNoneEditingDisplayedCenterCoordinate,
  getNoneEditingDisplayedFlipH,
  getNoneEditingDisplayedFlipV,
  getNoneEditingDisplayedPosition,
  getNoneEditingDisplayedRotation,
  getNoneEditingDisplayedSize,
  getTransformMatrix,
} from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';
import CommandHandler from '../CommandHandler';
import AppendTreeNodeCommand from '../../simplecommand/node/AppendTreeNodeCommand';
import RequestRerenderTreeNodeComponentCommand from '../../simplecommand/rerender/RequestRerenderTreeNodeComponentCommand';
import MoveTreeNodeCommand from '../../simplecommand/node/MoveTreeNodeCommand';
import RemoveTreeNodeCommand from '../../simplecommand/node/RemoveTreeNodeCommand';
import CommandController from '../../CommandController';
import SetGraphicAttributeCommand from '../../simplecommand/node/graphic/SetGraphicAttributeCommand';

interface IGraphicGroupCommandProps {
  commandId: CommandEnum.GROUP_OBJECTS | CommandEnum.UNGROUP;
}

export default class GraphicGroupCommandHandler extends CommandHandler {
  public processCommand(
    ctx: AppContext,
    commandProps: IGraphicGroupCommandProps
  ): ICommandHandlerResponse {
    switch (commandProps.commandId) {
      case CommandEnum.GROUP_OBJECTS: {
        this.groupObjects(ctx);
        break;
      }
      case CommandEnum.UNGROUP: {
        this.unGroup(ctx);
        break;
      }
      default: {
        break;
      }
    }
    return { isValid: true, terminate: true };
  }

  private groupObjects(ctx: AppContext) {
    const editableContext = ctx.getEditableContext();
    const selectionContainer = editableContext.getSelectionContainer();

    const selectedGraphicModels = selectionContainer
      .getGraphicModelSelectionContainer()
      .getSelectedGraphicModels();

    const isGroupChildSelected = selectedGraphicModels.some(graphicModel => {
      return isGroupChild(graphicModel);
    });

    if (selectedGraphicModels.length < 2 || isGroupChildSelected === true) {
      return;
    }

    const treeNodeRoot = editableContext.getTreeNodeRoot();

    const rootChildArray = treeNodeRoot.mapChild(child => {
      return child;
    });

    selectedGraphicModels.sort((a: GraphicModel, b: GraphicModel) => {
      if (rootChildArray.indexOf(a) < rootChildArray.indexOf(b)) return -1;
      if (rootChildArray.indexOf(a) > rootChildArray.indexOf(b)) return 1;
      return 0;
    });

    const groupNextSibling =
      selectedGraphicModels[selectedGraphicModels.length - 1].getNextSibling();

    this.createNewGroup(ctx, treeNodeRoot, selectedGraphicModels, groupNextSibling);
  }

  private unGroup(ctx: AppContext) {
    const editableContext = ctx.getEditableContext();
    const selectionContainer = editableContext.getSelectionContainer();

    const treeNodeRoot = editableContext.getTreeNodeRoot();
    const commandController = editableContext.getCommandController();

    if (commandController !== undefined) {
      const rootGroupSet = new Set<GraphicModel>();

      selectionContainer
        .getGraphicModelSelectionContainer()
        .getSelectedGraphicModels()
        .forEach((graphicModel: GraphicModel) => {
          const rootGroup = getRootGroup(graphicModel);

          if (rootGroup !== undefined) {
            rootGroupSet.add(rootGroup);
          }
        });

      if (rootGroupSet.size > 0) {
        const graphicModelListForNewSelection: GraphicModel[] = [];

        rootGroupSet.forEach((group: GraphicModel) => {
          group.forEachChild(child => {
            if (isGraphicModel(child)) {
              graphicModelListForNewSelection.push(child);
            }
          });

          this.unGroupChild(ctx, commandController, group, treeNodeRoot);
        });

        const requestRerenderCommand = new RequestRerenderTreeNodeComponentCommand(
          ctx,
          treeNodeRoot,
          true,
          true
        );
        commandController.appendPostSimpleCommand(requestRerenderCommand);

        updateNewSelectionContainer(ctx, graphicModelListForNewSelection);
      }
    }
  }

  protected createNewGroup(
    ctx: AppContext,
    parent: TreeNode,
    groupChildList: GraphicModel[],
    groupNextSibling: Nullable<TreeNode>
  ): void {
    const commandController = ctx.getEditableContext().getCommandController();
    if (commandController !== undefined) {
      const newGroupShape = createGraphicModelForGroupObject();

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      groupChildList.forEach(graphicModel => {
        const coordinateInfo = graphicModel.getCoordinateInfo();

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

      const coordinateInfo = newGroupShape.getCoordinateInfo();

      coordinateInfo.setX(minX);
      coordinateInfo.setY(minY);
      coordinateInfo.setWidth(maxX - minX);
      coordinateInfo.setHeight(maxY - minY);
      coordinateInfo.setGroupX(minX);
      coordinateInfo.setGroupY(minY);
      coordinateInfo.setGroupWidth(maxX - minX);
      coordinateInfo.setGroupHeight(maxY - minY);

      const appendTreeNodeCommand = new AppendTreeNodeCommand(
        newGroupShape,
        parent,
        groupNextSibling
      );
      commandController.appendSimpleCommand(appendTreeNodeCommand);

      // append group childs
      groupChildList.forEach(graphicModel => {
        const moveTreeNodeCommand = new MoveTreeNodeCommand(graphicModel, newGroupShape, undefined);
        commandController.appendSimpleCommand(moveTreeNodeCommand);
      });

      const requestRerenderCommand = new RequestRerenderTreeNodeComponentCommand(
        ctx,
        parent,
        true,
        true
      );
      commandController.appendPostSimpleCommand(requestRerenderCommand);

      updateNewSelectionContainer(ctx, [newGroupShape]);
    }
  }

  protected unGroupChild(
    ctx: AppContext,
    commandController: CommandController,
    group: GraphicModel,
    appendTarget: TreeNode
  ): void {
    let child = group.getLastChild();
    while (isGraphicModel(child)) {
      const childGraphicModel = child;
      const newNextSibling =
        child === group.getLastChild() ? group.getNextSibling() : child.getNextSibling();
      this.moveNode(ctx, childGraphicModel, appendTarget, newNextSibling);

      const oldCoordinateInfo = childGraphicModel.getCoordinateInfo();
      const newCoordinateInfo = oldCoordinateInfo.clone();

      const displayedPosition = getNoneEditingDisplayedPosition(childGraphicModel);
      newCoordinateInfo.setX(displayedPosition.x);
      newCoordinateInfo.setY(displayedPosition.y);

      const displayedSize = getNoneEditingDisplayedSize(childGraphicModel);
      newCoordinateInfo.setWidth(displayedSize.width);
      newCoordinateInfo.setHeight(displayedSize.height);

      const displayedRotation = getNoneEditingDisplayedRotation(childGraphicModel);
      newCoordinateInfo.setRotation(displayedRotation);

      const displayedFlipH = getNoneEditingDisplayedFlipH(childGraphicModel);
      const displayedFlipV = getNoneEditingDisplayedFlipV(childGraphicModel);

      newCoordinateInfo.setFlipH(displayedFlipH);
      newCoordinateInfo.setFlipV(displayedFlipV);

      const setCoordinateInfoCommand = new SetGraphicAttributeCommand(
        childGraphicModel,
        oldCoordinateInfo,
        newCoordinateInfo,
        childGraphicModel.setCoordinateInfo
      );
      commandController.appendSimpleCommand(setCoordinateInfoCommand);

      // newTransformationMatrix는
      // getNoneEditingAccumulatedTransformationMatrix 함수로 얻는 matrix와 같음
      const newTransformationMatrix = getTransformMatrix(
        oldCoordinateInfo,
        displayedPosition.x,
        displayedPosition.y,
        displayedSize.width,
        displayedSize.height,
        displayedFlipH,
        displayedFlipV,
        displayedRotation
      );

      const flipHList = new Array<boolean>();
      const flipVList = new Array<boolean>();
      const rotationList = new Array<number>();
      const wRatioList = new Array<number>();
      const hRatioList = new Array<number>();

      flipHList.push(displayedFlipH);
      flipVList.push(displayedFlipV);
      rotationList.push(displayedRotation);
      wRatioList.push(displayedSize.width / (oldCoordinateInfo.getGroupWidth() ?? 1));
      hRatioList.push(displayedSize.height / (oldCoordinateInfo.getGroupHeight() ?? 1));

      if (isGroup(childGraphicModel) === true) {
        this.applyChildTransformRecursively(
          ctx,
          commandController,
          childGraphicModel,
          newTransformationMatrix,
          flipHList,
          flipVList,
          rotationList,
          wRatioList,
          hRatioList
        );
      }

      child = child.getPrevSibling();
    }

    const removeTreeNodeCommand = new RemoveTreeNodeCommand(group);
    commandController?.appendSimpleCommand(removeTreeNodeCommand);
  }

  protected applyChildTransformRecursively(
    ctx: AppContext,
    commandController: CommandController,
    parentGroup: GraphicModel,
    parentTransformationMatrix: math.Matrix,
    flipHList: boolean[],
    flipVList: boolean[],
    rotationList: number[],
    wRatioList: number[],
    hRatioList: number[]
  ): void {
    parentGroup.forEachChild(child => {
      if (isGraphicModel(child)) {
        const childGraphicModel = child;

        const oldCoordinateInfo = childGraphicModel.getCoordinateInfo();
        const newCoordinateInfo = oldCoordinateInfo.clone();

        let accumulatedWRatio = 1;
        let accumulatedHRatio = 1;
        let accumulatedRotation = oldCoordinateInfo.getRotation();

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

        newCoordinateInfo.setWidth(newWidth);
        newCoordinateInfo.setHeight(newHeight);

        const displayedCenterCoordinate =
          getNoneEditingDisplayedCenterCoordinate(childGraphicModel);

        const newCenterCoordinate = math.multiply(
          math.inv(parentTransformationMatrix),
          math.matrix([[displayedCenterCoordinate.x], [displayedCenterCoordinate.y], [1]])
        );

        const newX = Number(newCenterCoordinate.get([0, 0])) - newWidth / 2;
        const newY = Number(newCenterCoordinate.get([1, 0])) - newHeight / 2;

        newCoordinateInfo.setX(newX);
        newCoordinateInfo.setY(newY);

        const setCoordinateInfoCommand = new SetGraphicAttributeCommand(
          childGraphicModel,
          oldCoordinateInfo,
          newCoordinateInfo,
          childGraphicModel.setCoordinateInfo
        );
        commandController.appendSimpleCommand(setCoordinateInfoCommand);

        if (isGroup(childGraphicModel) === true) {
          const displayedPosition = {
            x: displayedCenterCoordinate.x - displayedSize.width / 2,
            y: displayedCenterCoordinate.y - displayedSize.height / 2,
          };
          // newTransformationMatrix는
          // getNoneEditingAccumulatedTransformationMatrix 함수로 얻는 matrix와 같음
          // 하지만 depth에 따라 아래의 방식으로 직접 계산하는 것이 효율적임
          const newTransformationMatrix = getTransformMatrix(
            oldCoordinateInfo,
            displayedPosition.x,
            displayedPosition.y,
            displayedSize.width,
            displayedSize.height,
            getNoneEditingDisplayedFlipH(childGraphicModel),
            getNoneEditingDisplayedFlipV(childGraphicModel),
            getNoneEditingDisplayedRotation(childGraphicModel)
          );
          flipHList.push(oldCoordinateInfo.getFlipH());
          flipVList.push(oldCoordinateInfo.getFlipV());
          rotationList.push(oldCoordinateInfo.getRotation());
          wRatioList.push(newWidth / (oldCoordinateInfo.getGroupWidth() ?? 1));
          hRatioList.push(newHeight / (oldCoordinateInfo.getGroupHeight() ?? 1));

          this.applyChildTransformRecursively(
            ctx,
            commandController,
            childGraphicModel,
            newTransformationMatrix,
            flipHList,
            flipVList,
            rotationList,
            wRatioList,
            hRatioList
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

  private moveNode(
    ctx: AppContext,
    target: TreeNode,
    newParent: TreeNode,
    newNext?: TreeNode
  ): void {
    const commandController = ctx.getEditableContext().getCommandController();

    const moveTreeNodeCommand = new MoveTreeNodeCommand(target, newParent, newNext);
    commandController?.appendSimpleCommand(moveTreeNodeCommand);
  }
}
