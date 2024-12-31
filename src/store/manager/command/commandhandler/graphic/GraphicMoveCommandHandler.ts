import { CommandEnum } from 'types/store/command/CommandEnum';
import AppContext from 'store/context/AppContext';
import { ICommandHandlerResponse } from 'types/store/command/CommandTypes';
import { boundMethod } from 'autobind-decorator';
import {
  clearGraphicEditContext,
  updateNewSelectionContainer,
} from 'util/node/graphic/edit/GraphicModelEditingUtil';
import CommandHandler from '../CommandHandler';
import SetGraphicAttributeCommand from '../../simplecommand/node/graphic/SetGraphicAttributeCommand';
import RequestRerenderTreeNodeComponentCommand from '../../simplecommand/rerender/RequestRerenderTreeNodeComponentCommand';

interface IGraphicMoveCommandProps {
  commandId: CommandEnum.GRAPHIC_MOVE | CommandEnum.GRAPHIC_MOVE_ABORT;
}

export default class GraphicMoveCommandHandler extends CommandHandler {
  public processCommand(
    ctx: AppContext,
    commandProps: IGraphicMoveCommandProps
  ): ICommandHandlerResponse {
    switch (commandProps.commandId) {
      case CommandEnum.GRAPHIC_MOVE: {
        this.moveGraphicModelByEditContext(ctx, commandProps);
        break;
      }
      case CommandEnum.GRAPHIC_MOVE_ABORT: {
        this.clearGraphicModelEditContext(ctx);
        break;
      }
      default: {
        break;
      }
    }
    return { isValid: true, terminate: true };
  }

  @boundMethod
  protected moveGraphicModelByEditContext(
    ctx: AppContext,
    commandProps: IGraphicMoveCommandProps
  ): void {
    const editableContext = ctx.getEditableContext();
    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    const commandController = editableContext.getCommandController();

    if (commandController !== undefined) {
      graphicEditInfoContainer
        .getEditingDependentGraphicModelEditRequestMap()
        .forEach(graphicModelEditRequest => {
          const graphicModel = graphicModelEditRequest.getGraphicModel();

          const currentEditingCoordinateInfo =
            graphicModelEditRequest.getCurrentEditingCoordinateInfo();

          const oldCoordinateInfo = graphicModel.getCoordinateInfo();
          const newCoordinateInfo = currentEditingCoordinateInfo.clone();

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

      const editingGraphicModelList = graphicEditInfoContainer.getEditingGraphicModelList();
      updateNewSelectionContainer(ctx, editingGraphicModelList);
    }

    this.clearGraphicModelEditContext(ctx);
  }

  @boundMethod
  private clearGraphicModelEditContext(ctx: AppContext): void {
    const editableContext = ctx.getEditableContext();
    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    graphicEditInfoContainer.getEditingGraphicModelList().forEach(graphicModel => {
      graphicModel.requestRerender(ctx);
    });
    clearGraphicEditContext(ctx);
  }
}
