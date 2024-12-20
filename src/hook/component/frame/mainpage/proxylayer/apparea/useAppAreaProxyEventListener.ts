import { EventListenerOption } from 'hook/event/useEventListener';
import useAppStore from 'hook/store/useAppStore';
import { throttle } from 'lodash';
import React, { useMemo, useRef } from 'react';
import MouseEvent from 'store/manager/event/wrapper/MouseEvent';

type MouseHandlerType = (e: React.MouseEvent<HTMLElement | SVGElement>) => void;
type BlurHandlerType = (e: React.ChangeEvent<HTMLElement | SVGElement>) => void;

type ThrottledMouseHandlerType = MouseHandlerType & {
  cancel?: () => void;
};

type Hook = () => {
  appAreaProxyLayerRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: MouseHandlerType;
  handleMouseUp: MouseHandlerType;
  handleMouseMove: MouseHandlerType;
  handleMouseEnter: MouseHandlerType;
  handleMouseLeave: MouseHandlerType;
  handleMouseOut: MouseHandlerType;
  handleBlur: BlurHandlerType;
};

const useAppAreaProxyEventListener: Hook = (option?: EventListenerOption) => {
  const appAreaProxyLayerRef = useRef<HTMLDivElement>(null);
  const appStore = useAppStore();
  const extendedEventLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();
  const target = extendedEventLayerInfoContainer.getEventTarget();

  const handleMouseDown: MouseHandlerType = e => {
    if (target !== undefined) {
      const event = new MouseEvent(e, target);
      appStore.handleAppAreaMouseDown(event);
    }
  };

  const handleMouseUp: MouseHandlerType = e => {
    if (target !== undefined) {
      const event = new MouseEvent(e, target);
      appStore.handleAppAreaMouseUp(event);
    }
  };

  const handleMouseMove: ThrottledMouseHandlerType = useMemo((): MouseHandlerType => {
    const throttled = throttle((e, dragged) => {
      if (target !== undefined) {
        if (dragged) {
          const event = new MouseEvent(e, target);
          appStore.handleAppAreaDrag(event);
        } else {
          const event = new MouseEvent(e, target);
          appStore.handleAppAreaMouseMove(event);
        }
      }
    }, option?.eventDelay || 0);
    return e => {
      return throttled(e, appStore.getAppContext().getEditableContext().isMouseLButtonPressed());
    };
  }, []);

  const handleMouseEnter: MouseHandlerType = e => {
    window.removeEventListener('mouseup', onMouseUpCapture, true);
    window.removeEventListener('mousemove', onMouseMoveCapture, true);
  };

  const handleMouseLeave: MouseHandlerType = e => {
    window.addEventListener('mouseup', onMouseUpCapture, true);
    window.addEventListener('mousemove', onMouseMoveCapture, true);
  };

  const handleMouseOut: MouseHandlerType = e => {
    handleMouseMove.cancel?.();
  };

  const handleBlur: BlurHandlerType = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  function onMouseUpCapture(e: globalThis.MouseEvent): void {
    window.removeEventListener('mouseup', onMouseUpCapture, true);
    window.removeEventListener('mousemove', onMouseMoveCapture, true);
    if (appAreaProxyLayerRef.current !== null) {
      appAreaProxyLayerRef.current.dispatchEvent(e);
    }
  }

  function onMouseMoveCapture(e: globalThis.MouseEvent): void {
    if (appAreaProxyLayerRef.current !== null) {
      appAreaProxyLayerRef.current.dispatchEvent(e);
    }
  }

  return {
    appAreaProxyLayerRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseOut,
    handleBlur,
  };
};

export default useAppAreaProxyEventListener;
