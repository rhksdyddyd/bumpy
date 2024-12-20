import useResizeObserver from 'hook/event/useResizeObserver';
import useAppStore from 'hook/store/useAppStore';
import { useLayoutEffect, useRef } from 'react';
import { CursorType, ICursorInfo } from 'types/common/cursor/CursorTypes';

interface UseCompositeViewDividerProps {
  compositeViewRef: React.RefObject<HTMLDivElement>;
  firstChildRef: React.RefObject<HTMLDivElement>;
  dividerViewRef: React.RefObject<HTMLDivElement>;
  dividerControllerRef: React.RefObject<HTMLDivElement>;
  ratio: number;
  flexDirection: 'row' | 'column';
}

type HOOK = ({
  compositeViewRef,
  firstChildRef,
  dividerViewRef,
  dividerControllerRef,
  ratio,
  flexDirection,
}: UseCompositeViewDividerProps) => {
  firstChildCssStyle: React.CSSProperties;
  handleMouseDownCapture: (e: React.MouseEvent<Element>) => void;
};

const useCompositeViewDivider: HOOK = ({
  compositeViewRef,
  firstChildRef,
  dividerViewRef,
  dividerControllerRef,
  ratio,
  flexDirection,
}: UseCompositeViewDividerProps) => {
  const appStore = useAppStore();
  const proxyLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();

  const mouseCoordinateRef = useRef<number>(0);
  const initialSizeRef = useRef<number>(0);
  const compositeViewSizeRef = useRef<number>(0);

  const firstChildCssStyle =
    flexDirection === 'row' ? { width: `${ratio}%` } : { height: `${ratio}%` };

  const setRatio =
    flexDirection === 'row'
      ? (newRatio: number): void => {
          const firstChild = firstChildRef.current;
          if (firstChild !== null) {
            firstChild.style.width = `${newRatio}%`;
          }
        }
      : (newRatio: number): void => {
          const firstChild = firstChildRef.current;
          if (firstChild !== null) {
            firstChild.style.height = `${newRatio}%`;
          }
        };

  const updateDivider =
    flexDirection === 'row'
      ? () => {
          if (dividerViewRef.current !== null && dividerControllerRef.current !== null) {
            const dividerControllerDivElement = dividerControllerRef.current;
            const dividerControllerWidth = 10 / window.devicePixelRatio;
            const dividerViewRect = dividerViewRef.current.getBoundingClientRect();

            const dividerControllerStyle = `left:${
              dividerViewRect.left - (dividerControllerWidth - dividerViewRect.width) / 2
            }px; width:${dividerControllerWidth}px; height:${dividerViewRect.height}px;`;
            dividerControllerDivElement.style.cssText = dividerControllerStyle;
          }
        }
      : () => {
          if (dividerViewRef.current !== null && dividerControllerRef.current !== null) {
            const dividerControllerDivElement = dividerControllerRef.current;
            const dividerControllerHeight = 10 / window.devicePixelRatio;
            const dividerViewRect = dividerViewRef.current.getBoundingClientRect();

            const dividerControllerStyle = `top:${
              dividerViewRect.top - (dividerControllerHeight - dividerViewRect.height) / 2
            }px; width:${dividerViewRect.width}px; height:${dividerControllerHeight}px;`;
            dividerControllerDivElement.style.cssText = dividerControllerStyle;
          }
        };

  useResizeObserver({ targetRef: firstChildRef, callback: updateDivider });

  const getMouseCoordinate =
    flexDirection === 'row'
      ? (e: React.MouseEvent<Element> | MouseEvent): number => {
          return e.clientX;
        }
      : (e: React.MouseEvent<Element> | MouseEvent): number => {
          return e.clientY;
        };

  const setMouseCoordinate =
    flexDirection === 'row'
      ? (e: React.MouseEvent<Element>): void => {
          mouseCoordinateRef.current = e.clientX;
        }
      : (e: React.MouseEvent<Element>): void => {
          mouseCoordinateRef.current = e.clientY;
        };

  const getFirstChildSize =
    flexDirection === 'row'
      ? (): number => {
          return firstChildRef.current?.getBoundingClientRect().width ?? 0;
        }
      : (): number => {
          return firstChildRef.current?.getBoundingClientRect().height ?? 0;
        };

  const setInitialSize =
    flexDirection === 'row'
      ? (): void => {
          initialSizeRef.current = getFirstChildSize();
        }
      : (): void => {
          initialSizeRef.current = getFirstChildSize();
        };

  const getCompositeViewSize =
    flexDirection === 'row'
      ? (): number => {
          return compositeViewRef.current?.getBoundingClientRect().width ?? 0;
        }
      : (): number => {
          return compositeViewRef.current?.getBoundingClientRect().height ?? 0;
        };

  const setCompositeViewSize =
    flexDirection === 'row'
      ? (): void => {
          compositeViewSizeRef.current = getCompositeViewSize();
        }
      : (): void => {
          compositeViewSizeRef.current = getCompositeViewSize();
        };

  const cursorInfo: ICursorInfo =
    flexDirection === 'row'
      ? { cursorType: CursorType.ew_resize }
      : { cursorType: CursorType.ns_resize };

  const handleMouseMoveCapture = (e: MouseEvent): void => {
    const currentMouseCoordinate = getMouseCoordinate(e);
    const newSize = Math.max(
      initialSizeRef.current - mouseCoordinateRef.current + currentMouseCoordinate,
      100
    );
    const newRatio = Math.min((newSize / compositeViewSizeRef.current) * 100, 100);
    setRatio(newRatio);
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  function handleMouseDownCapture(e: React.MouseEvent<Element>): void {
    proxyLayerInfoContainer.enableAppAreaProxyLayer(undefined, cursorInfo, false, false);
    mouseCoordinateRef.current = getMouseCoordinate(e);
    setMouseCoordinate(e);
    setInitialSize();
    setCompositeViewSize();
    window.addEventListener('mousemove', handleMouseMoveCapture, true);
    window.addEventListener('mouseup', handleMouseUpCapture, true);
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  function handleMouseUpCapture(e: MouseEvent): void {
    proxyLayerInfoContainer.disableAppAreaProxyLayer();
    window.removeEventListener('mousemove', handleMouseMoveCapture, true);
    window.removeEventListener('mouseup', handleMouseUpCapture, true);
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  return { firstChildCssStyle, handleMouseDownCapture };
};

export default useCompositeViewDivider;
