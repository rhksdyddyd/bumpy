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

export interface IGraphicRotateCommandProps {
  commandId: CommandEnum.GRAPHIC_ROTATE | CommandEnum.GRAPHIC_ROTATE_ABORT;
}

export default class GraphicRotateCommandHandler extends CommandHandler {
  public override processCommand(
    ctx: AppContext,
    commandProps: IGraphicRotateCommandProps
  ): ICommandHandlerResponse {
    switch (commandProps.commandId) {
      case CommandEnum.GRAPHIC_ROTATE: {
        this.rotateGraphicModelByEditContext(ctx);
        break;
      }
      case CommandEnum.GRAPHIC_ROTATE_ABORT: {
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
  private rotateGraphicModelByEditContext(ctx: AppContext): void {
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
