import React, { useCallback, useMemo } from 'react';
import { throttle } from 'lodash';
import TreeNode from 'model/node/TreeNode';
import useAppStore from 'hook/store/useAppStore';
import MouseEvent from 'store/manager/event/wrapper/MouseEvent';
import WheelEvent from 'store/manager/event/wrapper/WheelEvent';
import KeyEvent from 'store/manager/event/wrapper/KeyEvent';

/**
 * event 처리 옵션
 */
export type EventListenerOption = {
  eventDelay?: number;
  useDrag?: boolean;
};

/**
 * Mouse Event 관련 EventListener  함수의 형태입니다.
 */
type MouseHandlerType = (e: React.MouseEvent<HTMLElement | SVGElement>) => void;
/**
 * Mouse Wheel Event 관련 EventListener  함수의 형태입니다.
 */
type WheelHandlerType = (e: React.WheelEvent<HTMLElement>) => void;
/**
 * Key Event 관련 EventListener  함수의 형태입니다.
 */
type KeyHandlerType = (e: React.KeyboardEvent<HTMLElement>) => void;

/**
 * EventListener 를 생성하기 위한 정의입니다.
 */
type Hook = (
  node: TreeNode,
  option?: EventListenerOption
) => {
  handleMouseDown: MouseHandlerType;
  handleMouseUp: MouseHandlerType;
  handleMouseMove: MouseHandlerType;
  handleDrag: MouseHandlerType;
  handleWheel: WheelHandlerType;
  handleKeyDown: KeyHandlerType;
  handleKeyUp: KeyHandlerType;
};

/**
 * 각 component에 event가 발생하였을 때, event를 처리할 수 있는 함수를 반환하는 hook입니다.
 * react event를 wrapping 하고, appStore의 event 처리 함수를 호출하는 역할을 합니다.
 *
 * @param treeNode event가 발생 한 treeNode
 * @param option event 처리 옵션
 * @returns event를 처리할 수 있는 함수 목록
 */
const useEventListener: Hook = (eventTargetModel: TreeNode, option?: EventListenerOption) => {
  const eventDelay = option?.eventDelay || 0;
  const isDragEnabled = option?.useDrag !== false;

  const appStore = useAppStore();

  const handleMouseDown: MouseHandlerType = useCallback(
    e => {
      const event = new MouseEvent(e, eventTargetModel);
      appStore.handleMouseDown(event);
    },
    [eventTargetModel]
  );

  const handleMouseUp: MouseHandlerType = useCallback(
    e => {
      const event = new MouseEvent(e, eventTargetModel);
      appStore.handleMouseUp(event);

      if (e.button === 2) {
        // need implement
        // 필요한 경우 context menu 보여주기
      }
    },
    [eventTargetModel]
  );

  const handleMouseMove: MouseHandlerType = useMemo((): MouseHandlerType => {
    const throttled = throttle((e, dragged) => {
      const event = new MouseEvent(e, eventTargetModel);
      if (dragged) {
        appStore.handleDrag(event);
      } else {
        appStore.handleMouseMove(event);
      }
    }, eventDelay);
    return e => {
      e.persist();
      return throttled(
        e,
        isDragEnabled && appStore.getAppContext().getEditableContext().isMouseLButtonPressed()
      );
    };
  }, [eventTargetModel]);

  const handleDrag: MouseHandlerType = useMemo((): MouseHandlerType => {
    const throttled = throttle((e, dragged) => {
      if (!dragged) {
        return;
      }
      const event = new MouseEvent(e, eventTargetModel);
      appStore.handleDrag(event);
    }, eventDelay);
    return e => {
      e.persist();
      return throttled(
        e,
        isDragEnabled && appStore.getAppContext().getEditableContext().isMouseLButtonPressed()
      );
    };
  }, [eventTargetModel]);

  const handleWheel: WheelHandlerType = useCallback(
    e => {
      const event = new WheelEvent(e, eventTargetModel);
      appStore.handleWheel(event);
    },
    [eventTargetModel]
  );

  const handleKeyDown: KeyHandlerType = useCallback(
    e => {
      const event = new KeyEvent(e, eventTargetModel);
      appStore.handleKeyDown(event);
    },
    [eventTargetModel]
  );

  const handleKeyUp: KeyHandlerType = useCallback(
    e => {
      const event = new KeyEvent(e, eventTargetModel);
      appStore.handleKeyUp(event);
    },
    [eventTargetModel]
  );

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleDrag,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
  };
};

export default useEventListener;
