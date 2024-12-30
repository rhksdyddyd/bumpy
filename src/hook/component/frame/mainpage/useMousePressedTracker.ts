import useRegisterEventHandler from 'hook/event/useRegisterEventListener';
import useAppStore from 'hook/store/useAppStore';

type Hook = () => void;

const useMousePressedTracker: Hook = () => {
  const appStore = useAppStore();
  const editableContext = appStore.getAppContext().getEditableContext();

  function onMouseDown(e: globalThis.MouseEvent) {
    if (e.buttons === 1) {
      editableContext.setMouseLButtonPressed(true);
    } else {
      editableContext.setMouseLButtonPressed(false);
    }
  }

  function onMouseUp() {
    editableContext.setMouseLButtonPressed(false);
  }

  useRegisterEventHandler({
    eventType: 'mousedown',
    eventHandler: onMouseDown,
    allowRegister: true,
  });
  useRegisterEventHandler({
    eventType: 'mouseup',
    eventHandler: onMouseUp,
    allowRegister: true,
    capture: true,
  });
};

export default useMousePressedTracker;
