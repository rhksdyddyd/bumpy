import useResizeObserver from 'hook/event/useResizeObserver';
import useAppStore from 'hook/store/useAppStore';
import { useRef } from 'react';
import { IRect } from 'types/common/geometry/GeometryTypes';

type Hook = () => {
  editViewProxyLayerRef: React.RefObject<HTMLDivElement>;
  editViewRectInfo: IRect;
};

const useEditViewProxyLayer: Hook = () => {
  const appStore = useAppStore();
  const viewModeContainer = appStore.getAppContext().getEditableContext().getViewModeContainer();

  const editViewSizeTrackerRef = viewModeContainer.getEditViewSizeTrackerRef();
  const editViewBoundingClientRect = editViewSizeTrackerRef?.current?.getBoundingClientRect();

  const editViewProxyLayerRef = useRef<HTMLDivElement>(null);

  const resizeCallback = () => {
    if (
      editViewSizeTrackerRef !== undefined &&
      editViewSizeTrackerRef.current !== null &&
      editViewProxyLayerRef.current !== null
    ) {
      const rect = editViewSizeTrackerRef.current.getBoundingClientRect();
      const editViewProxyLayerElement = editViewProxyLayerRef.current;
      editViewProxyLayerElement.style.cssText = `${editViewProxyLayerElement.style.cssText}top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px;`;
    }
  };

  useResizeObserver<HTMLDivElement>({
    targetRef: editViewSizeTrackerRef,
    callback: resizeCallback,
  });

  const editViewRectInfo = editViewBoundingClientRect
    ? {
        left: editViewBoundingClientRect.left,
        top: editViewBoundingClientRect.top,
        right: editViewBoundingClientRect.right,
        bottom: editViewBoundingClientRect.bottom,
        height: editViewBoundingClientRect.height,
        width: editViewBoundingClientRect.width,
      }
    : {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        height: 0,
        width: 0,
      };

  return {
    editViewProxyLayerRef,
    editViewRectInfo,
  };
};

export default useEditViewProxyLayer;
