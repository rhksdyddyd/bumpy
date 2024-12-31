import { boundMethod } from 'autobind-decorator';
import { CommandEnum } from 'types/store/command/CommandEnum';
import AppContext from 'store/context/AppContext';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import EventHandler from '../EventHandler';
import KeyEvent from '../../wrapper/KeyEvent';
import MouseEvent from '../../wrapper/MouseEvent';

export default class GraphicEventHandler extends EventHandler {
  @boundMethod
  public override onKeyDown(event: KeyEvent, ctx: AppContext): boolean {
    const editableContext = ctx.getEditableContext();

    switch (true) {
      case /^Backspace$/.test(event.getKey()):
      case /^Delete$/.test(event.getKey()): {
        editableContext.setCommandProps({ commandId: CommandEnum.DELETE_GRAPHIC });
        event.preventDefault();
        return true;
      }
      case /^Escape$/.test(event.getKey()): {
        const newSelectionContainer = editableContext.createSelectionContainer();
        editableContext.setCommandProps({ commandId: CommandEnum.INVALID, newSelectionContainer });
        return true;
      }
      default:
        break;
    }

    return false;
  }

  @boundMethod
  public override onMouseDown(event: MouseEvent, ctx: AppContext): boolean {
    const editableContext = ctx.getEditableContext();
    const newSelectionContainer = editableContext.createSelectionContainer();
    editableContext.setCommandProps({ commandId: CommandEnum.INVALID, newSelectionContainer });

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    graphicEditInfoContainer.setRangeSelectionStartPosition({
      x: event.getClientX(),
      y: event.getClientY(),
    });
    graphicEditInfoContainer.setRangeSelectionEndPosition({
      x: event.getClientX(),
      y: event.getClientY(),
    });

    graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.PRESSED);
    return true;
  }

  @boundMethod
  public override onDrag(event: MouseEvent, ctx: AppContext): boolean {
    const editableContext = ctx.getEditableContext();
    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    graphicEditInfoContainer.setRangeSelectionEndPosition({
      x: event.getClientX(),
      y: event.getClientY(),
    });

    graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.DRAG);
    return true;
  }

  @boundMethod
  public override onMouseUp(event: MouseEvent, ctx: AppContext): boolean {
    const editableContext = ctx.getEditableContext();
    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    if (
      graphicEditInfoContainer.getGraphicEditEventSubState() === GraphicEditEventSubStateEnum.DRAG
    ) {
      const startPosition = graphicEditInfoContainer.getRangeSelectionStartPosition();
      const endPosition = graphicEditInfoContainer.getRangeSelectionEndPosition();
      // TODO: range selection
    }
    graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.NONE);

    return false;
  }
}
