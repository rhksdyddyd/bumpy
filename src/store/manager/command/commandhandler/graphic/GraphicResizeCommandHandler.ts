import { boundMethod } from 'autobind-decorator';
import { CommandEnum } from 'types/store/command/CommandEnum';
import { ICommandHandlerResponse } from 'types/store/command/CommandTypes';
import AppContext from 'store/context/AppContext';
import {
  clearGraphicEditContext,
  updateNewSelectionContainer,
} from 'util/node/graphic/edit/GraphicModelEditingUtil';
import CommandHandler from '../CommandHandler';
import SetGraphicAttributeCommand from '../../simplecommand/node/graphic/SetGraphicAttributeCommand';
import RequestRerenderTreeNodeComponentCommand from '../../simplecommand/rerender/RequestRerenderTreeNodeComponentCommand';

interface IGraphicResizeCommandProps {
  commandId: CommandEnum.GRAPHIC_RESIZE | CommandEnum.GRAPHIC_RESIZE_ABORT;
}

export default class GraphicResizeCommandHandler extends CommandHandler {
  public override processCommand(
    ctx: AppContext,
    commandProps: IGraphicResizeCommandProps
  ): ICommandHandlerResponse {
    switch (commandProps.commandId) {
      case CommandEnum.GRAPHIC_RESIZE: {
        this.resizeGraphicModelByEditContext(ctx);
        break;
      }
      case CommandEnum.GRAPHIC_RESIZE_ABORT: {
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
  private resizeGraphicModelByEditContext(ctx: AppContext): void {
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
