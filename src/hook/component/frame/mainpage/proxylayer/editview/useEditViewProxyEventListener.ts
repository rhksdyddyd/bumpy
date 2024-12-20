import { EventListenerOption } from 'hook/event/useEventListener';
import useAppStore from 'hook/store/useAppStore';
import { throttle } from 'lodash';
import { useMemo } from 'react';
import MouseEvent from 'store/manager/event/wrapper/MouseEvent';

type MouseHandlerType = (e: React.MouseEvent<HTMLElement | SVGElement>) => void;

type ThrottledMouseHandlerType = MouseHandlerType & {
  cancel?: () => void;
};

type Hook = (option?: EventListenerOption) => {
  handleMouseDown: MouseHandlerType;
  handleMouseUp: MouseHandlerType;
  handleMouseMove: MouseHandlerType;
  handleMouseLeave: MouseHandlerType;
};

const useEditViewProxyEventListener: Hook = (option?: EventListenerOption) => {
  const appStore = useAppStore();
  const proxyLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();
  const target = proxyLayerInfoContainer.getEventTarget();

  const handleMouseDown: MouseHandlerType = e => {
    if (target !== undefined) {
      const event = new MouseEvent(e, target);
      appStore.handleMouseDown(event);
    }
  };

  const handleMouseUp: MouseHandlerType = e => {
    if (target !== undefined) {
      const event = new MouseEvent(e, target);
      appStore.handleMouseUp(event);
    }
  };

  const handleMouseMove: ThrottledMouseHandlerType = useMemo((): MouseHandlerType => {
    const throttled = throttle((e, dragged) => {
      if (target !== undefined) {
        if (dragged) {
          const event = new MouseEvent(e, target);
          appStore.handleDrag(event);
        } else {
          const event = new MouseEvent(e, target);
          appStore.handleMouseMove(event);
        }
      }
    }, option?.eventDelay || 0);
    return e => {
      e.stopPropagation();
      return throttled(e, appStore.getAppContext().getEditableContext().isMouseLButtonPressed());
    };
  }, []);

  const handleMouseLeave: MouseHandlerType = e => {
    handleMouseMove.cancel?.();
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
  };
};

export default useEditViewProxyEventListener;
