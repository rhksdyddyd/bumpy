import useAppStore from 'hook/store/useAppStore';
import GraphicModel from 'model/node/graphic/GraphicModel';
import MouseEvent from 'store/manager/event/wrapper/MouseEvent';
import {
  GraphicMouseEvent,
  GraphicMouseHandlerType,
} from 'types/hook/graphic/GraphicEventHookTypes';
import { EventStateEnum } from 'types/store/event/EventStateEnum';

export type Hook = (graphicModel: GraphicModel) => {
  handleMouseDown: GraphicMouseHandlerType;
};

const useGraphicComponentEventListener: Hook = (graphicModel: GraphicModel) => {
  const appStore = useAppStore();
  const editableContext = appStore.getAppContext().getEditableContext();
  const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

  const handleMouseDown = (e: GraphicMouseEvent) => {
    if (editableContext.getEventState() === EventStateEnum.IDLE) {
      editableContext.setEventState(EventStateEnum.GRAPHIC_MOVE);
      graphicEditInfoContainer.setEventTargetGraphicModel(graphicModel);
    }

    const event = new MouseEvent(e, graphicModel);
    appStore.handleMouseDown(event);
  };

  return {
    handleMouseDown,
  };
};

export default useGraphicComponentEventListener;
