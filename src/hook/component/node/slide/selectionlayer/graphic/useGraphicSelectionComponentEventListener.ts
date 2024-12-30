import useEventListener from 'hook/event/useEventListener';
import useAppStore from 'hook/store/useAppStore';
import GraphicModel from 'model/node/graphic/GraphicModel';
import { CursorType } from 'types/common/cursor/CursorTypes';
import {
  EditingHandleMouseHandlerType,
  GraphicMouseEvent,
  GraphicMouseHandlerType,
} from 'types/hook/graphic/GraphicEventHookTypes';
import { ResourceEnum } from 'types/resource/ResourceEnum';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import { GraphicEditingHandleEnum } from 'types/store/container/edit/GraphicEditingHandleEnum';
import { EventStateEnum } from 'types/store/event/EventStateEnum';

type Hook = (graphicModel: GraphicModel) => {
  handleMouseDownForMove: GraphicMouseHandlerType;
  handleMouseDownForResize: EditingHandleMouseHandlerType;
  handleMouseDownForRotation: GraphicMouseHandlerType;
  handleMouseUp: GraphicMouseHandlerType;
};

const useGraphicSelectionComponentEventListener: Hook = (graphicModel: GraphicModel) => {
  const appStore = useAppStore();
  const editableContext = appStore.getAppContext().getEditableContext();
  const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

  const { handleMouseDown, handleMouseUp } = useEventListener(graphicModel);

  const handleMouseDownForMove = (e: GraphicMouseEvent) => {
    if (editableContext.getEventState() === EventStateEnum.IDLE) {
      editableContext.setEventState(EventStateEnum.GRAPHIC_MOVE);
      graphicEditInfoContainer.setEventTargetGraphicModel(graphicModel);
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.READY);
      graphicEditInfoContainer.setCursorInfo({ cursorType: 'move' });
    }
    handleMouseDown(e);
  };

  const handleMouseDownForResize = (
    e: GraphicMouseEvent,
    editingHandle: GraphicEditingHandleEnum,
    cursor: string
  ) => {
    if (editableContext.getEventState() === EventStateEnum.IDLE) {
      editableContext.setEventState(EventStateEnum.GRAPHIC_RESIZE);
      graphicEditInfoContainer.setEventTargetGraphicModel(graphicModel);
      graphicEditInfoContainer.setGraphicEditingHandle(editingHandle);
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.READY);
      graphicEditInfoContainer.setCursorInfo({ cursorType: cursor as CursorType });
    }
    handleMouseDown(e);
  };

  const handleMouseDownForRotation = (e: GraphicMouseEvent) => {
    if (editableContext.getEventState() === EventStateEnum.IDLE) {
      editableContext.setEventState(EventStateEnum.GRAPHIC_ROTATE);
      graphicEditInfoContainer.setEventTargetGraphicModel(graphicModel);
      graphicEditInfoContainer.setGraphicEditingHandle(GraphicEditingHandleEnum.ROTATE);
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.READY);
      graphicEditInfoContainer.setCursorInfo({
        cursorType: 'img',
        img: ResourceEnum.IMG_CURSOR_ROTATE,
        position: {
          x: 15,
          y: 15,
        },
      });
    }
    handleMouseDown(e);
  };

  return {
    handleMouseDownForMove,
    handleMouseDownForResize,
    handleMouseDownForRotation,
    handleMouseUp,
  };
};

export default useGraphicSelectionComponentEventListener;
