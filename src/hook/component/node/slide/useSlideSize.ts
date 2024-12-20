import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import useResizeObserver from 'hook/event/useResizeObserver';
import { IRect } from 'types/common/geometry/GeometryTypes';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';
import {
  EditViewScollBarSize,
  SlideComponentBasicMargin,
} from 'types/component/node/slide/SlideComponentTypes';
import SlideModel from 'model/node/slide/SlideModel';
import { EditViewSizeTrackerId } from 'types/component/frame/workarea/edit/EditViewTypes';
import useAppStore from 'hook/store/useAppStore';

type Hook = (props: TreeNodeComponentProps) => {
  contentsWrapperRef: React.RefObject<HTMLDivElement>;
  contentsRef: React.RefObject<HTMLDivElement>;
  slideBackgroundRef: React.RefObject<SVGSVGElement>;
};

const useSlideSize: Hook = (props: TreeNodeComponentProps) => {
  const appStore = useAppStore();

  const isFitZoom = appStore
    .getAppContext()
    .getEditableContext()
    .getViewModeContainer()
    .getIsFitZoom();
  const { model } = props;
  const slideModel = model as SlideModel;

  const calculateContentsSizeRef = useRef<number>(0);

  useEffect(() => {
    slideModel.setCalculateContentsSizeRef(calculateContentsSizeRef);

    return () => {
      slideModel.setCalculateContentsSizeRef(undefined);
    };
  }, []);

  const editViewSizeTrackerRef = useRef<HTMLElement>(null);
  const contentsWrapperRef = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);
  const slideBackgroundRef = useRef<SVGSVGElement>(null);

  const editViewRectRef = useRef<IRect>({
    left: Number.MAX_SAFE_INTEGER,
    top: Number.MAX_SAFE_INTEGER,
    right: Number.MIN_SAFE_INTEGER,
    bottom: Number.MIN_SAFE_INTEGER,
    width: 0,
    height: 0,
  });
  const contentsBoundingRectRef = useRef<IRect>({
    left: Number.MAX_SAFE_INTEGER,
    top: Number.MAX_SAFE_INTEGER,
    right: Number.MIN_SAFE_INTEGER,
    bottom: Number.MIN_SAFE_INTEGER,
    width: 0,
    height: 0,
  });
  const slideBackgroundRectRef = useRef<IRect>({
    left: Number.MAX_SAFE_INTEGER,
    top: Number.MAX_SAFE_INTEGER,
    right: Number.MIN_SAFE_INTEGER,
    bottom: Number.MIN_SAFE_INTEGER,
    width: 0,
    height: 0,
  });

  const slideOffsetTopRef = useRef<number>(0);
  const slideOffsetLeftRef = useRef<number>(0);

  const setRectInfo = useCallback(
    (rectInfoRef: React.MutableRefObject<IRect>, domRect: DOMRect): void => {
      const rectInfo = rectInfoRef.current;
      rectInfo.left = domRect.left;
      rectInfo.top = domRect.top;
      rectInfo.right = domRect.right;
      rectInfo.bottom = domRect.bottom;
      rectInfo.width = domRect.width;
      rectInfo.height = domRect.height;
    },
    []
  );

  useLayoutEffect(() => {
    const editViewSizeTracker = document.getElementById(EditViewSizeTrackerId);
    if (editViewSizeTracker !== null) {
      (editViewSizeTrackerRef as MutableRefObject<HTMLElement>).current = editViewSizeTracker;
      setRectInfo(editViewRectRef, editViewSizeTracker.getBoundingClientRect());
    }
  }, []);

  const getContentsBoundingRect = useCallback((element: Element) => {
    const { children } = element;
    for (let i = 0; i < children.length; i += 1) {
      const child = children.item(i);
      if (child !== null) {
        getContentsBoundingRect(child);
      }
    }
    const elementRect = element.getBoundingClientRect();
    const contentsBoundingRect = contentsBoundingRectRef.current;
    contentsBoundingRect.left = Math.min(contentsBoundingRect.left, elementRect.left);
    contentsBoundingRect.top = Math.min(contentsBoundingRect.top, elementRect.top);
    contentsBoundingRect.right = Math.max(contentsBoundingRect.right, elementRect.right);
    contentsBoundingRect.bottom = Math.max(contentsBoundingRect.bottom, elementRect.bottom);
  }, []);

  useLayoutEffect(() => {
    if (contentsRef.current !== null && slideBackgroundRef.current !== null) {
      const contentsBoundingRect = contentsBoundingRectRef.current;

      contentsBoundingRect.top = Number.MAX_SAFE_INTEGER;
      contentsBoundingRect.left = Number.MAX_SAFE_INTEGER;
      contentsBoundingRect.bottom = Number.MIN_SAFE_INTEGER;
      contentsBoundingRect.right = Number.MIN_SAFE_INTEGER;
      contentsBoundingRect.width = 0;
      contentsBoundingRect.height = 0;

      getContentsBoundingRect(contentsRef.current);
      contentsBoundingRect.width = contentsBoundingRect.right - contentsBoundingRect.left;
      contentsBoundingRect.height = contentsBoundingRect.bottom - contentsBoundingRect.top;

      setRectInfo(slideBackgroundRectRef, slideBackgroundRef.current.getBoundingClientRect());
    }
  }, [calculateContentsSizeRef.current]);

  const updateSlideSize = useCallback((updateScrollBar: boolean) => {
    if (contentsWrapperRef.current !== null && contentsRef.current !== null) {
      const editViewRect = editViewRectRef.current;
      const containerRect = { ...editViewRect };
      const contentsBoundingRect = contentsBoundingRectRef.current;
      const slideBackgroundRect = slideBackgroundRectRef.current;

      let slideWrapperWidth = 0;
      let slideWrapperHeight = 0;
      let slideOffsetTop = 0;
      let slideOffsetLeft = 0;
      let editViewScrollTop = 0;
      let editViewScrollLeft = 0;

      const contentsOutsideTop = slideBackgroundRect.top - contentsBoundingRect.top;
      const contentsOutsideLeft = slideBackgroundRect.left - contentsBoundingRect.left;
      const contentsOutsideBottom = contentsBoundingRect.bottom - slideBackgroundRect.bottom;
      const contentsOutsideRight = contentsBoundingRect.right - slideBackgroundRect.right;

      containerRect.width -= 2 * SlideComponentBasicMargin;
      containerRect.height -= 2 * SlideComponentBasicMargin;

      if (containerRect.width < contentsBoundingRect.width) {
        containerRect.height -= EditViewScollBarSize;
        if (containerRect.height < contentsBoundingRect.height) {
          containerRect.width -= EditViewScollBarSize;
        }
      } else if (containerRect.height < contentsBoundingRect.height) {
        containerRect.width -= EditViewScollBarSize;
        if (containerRect.width < contentsBoundingRect.width) {
          containerRect.height -= EditViewScollBarSize;
        }
      }

      const availableWidth = (containerRect.width - slideBackgroundRect.width) / 2;
      const availableHeight = (containerRect.height - slideBackgroundRect.height) / 2;

      let isScrollNeeded = false;

      if (containerRect.width < contentsBoundingRect.width) {
        slideWrapperWidth = contentsBoundingRect.width + SlideComponentBasicMargin * 2;
        slideOffsetLeft = contentsOutsideLeft + SlideComponentBasicMargin;
        if (contentsOutsideLeft <= availableWidth) {
          // scroll to 0
        } else if (contentsOutsideRight <= availableWidth) {
          isScrollNeeded = true;
          editViewScrollLeft = slideWrapperWidth;
        } else {
          isScrollNeeded = true;
          editViewScrollLeft =
            slideOffsetLeft + slideBackgroundRect.width / 2 - containerRect.width / 2;
        }
      } else {
        slideWrapperWidth = Math.max(
          containerRect.width,
          contentsBoundingRect.width + SlideComponentBasicMargin * 2
        );
        if (contentsOutsideLeft <= availableWidth && contentsOutsideRight <= availableWidth) {
          slideOffsetLeft = SlideComponentBasicMargin + availableWidth;
        } else if (contentsOutsideLeft <= availableWidth) {
          slideOffsetLeft =
            SlideComponentBasicMargin + availableWidth - (contentsOutsideRight - availableWidth);
        } else if (contentsOutsideRight <= availableWidth) {
          slideOffsetLeft = SlideComponentBasicMargin + contentsOutsideLeft;
        }
      }

      if (containerRect.height < contentsBoundingRect.height) {
        slideWrapperHeight = contentsBoundingRect.height + SlideComponentBasicMargin * 2;
        slideOffsetTop = contentsOutsideTop + SlideComponentBasicMargin;
        if (contentsOutsideTop <= availableHeight) {
          // scroll to 0
        } else if (contentsOutsideBottom <= availableHeight) {
          isScrollNeeded = true;
          editViewScrollTop = slideWrapperHeight;
        } else {
          isScrollNeeded = true;
          editViewScrollTop =
            slideOffsetTop + slideBackgroundRect.height / 2 - containerRect.height / 2;
        }
      } else {
        slideWrapperHeight = Math.max(
          containerRect.height,
          contentsBoundingRect.height + SlideComponentBasicMargin * 2
        );
        if (contentsOutsideTop <= availableHeight && contentsOutsideBottom <= availableHeight) {
          slideOffsetTop = SlideComponentBasicMargin + availableHeight;
        } else if (contentsOutsideTop <= availableHeight) {
          slideOffsetTop =
            SlideComponentBasicMargin + availableHeight - (contentsOutsideBottom - availableHeight);
        } else if (contentsOutsideBottom <= availableHeight) {
          slideOffsetTop = SlideComponentBasicMargin + contentsOutsideTop;
        }
      }

      const diffTop = slideOffsetTop - slideOffsetTopRef.current;
      const diffLeft = slideOffsetLeft - slideOffsetLeftRef.current;

      slideBackgroundRect.top += diffTop;
      slideBackgroundRect.left += diffLeft;
      slideBackgroundRect.bottom += diffTop;
      slideBackgroundRect.right += diffLeft;

      contentsBoundingRect.top += diffTop;
      contentsBoundingRect.left += diffLeft;
      contentsBoundingRect.bottom += diffTop;
      contentsBoundingRect.right += diffLeft;

      contentsWrapperRef.current.style.cssText = `width:${slideWrapperWidth}px; height:${slideWrapperHeight}px;`;
      contentsRef.current.style.cssText = `top:${slideOffsetTop}px; left:${slideOffsetLeft}px;`;

      slideOffsetTopRef.current = slideOffsetTop;
      slideOffsetLeftRef.current = slideOffsetLeft;

      if (updateScrollBar === true && isScrollNeeded === true) {
        const editViewHTMLElement = document.getElementById(EditViewSizeTrackerId);
        if (editViewHTMLElement !== null) {
          setTimeout(() => {
            editViewHTMLElement.scrollTo({
              top: editViewScrollTop,
              left: editViewScrollLeft,
              behavior: 'smooth',
            });
          }, 0);
        }
      }
    }
  }, []);

  useResizeObserver({
    targetRef: editViewSizeTrackerRef,
    callback: entry => {
      if (editViewSizeTrackerRef.current !== null) {
        setRectInfo(editViewRectRef, entry.target.getBoundingClientRect());

        // offset 보존
        // 임시 image 로 표시 (timer)
        // dom-to-image / html2canvas
        // viewModeContainer.setZoomRatio(1);
        // viewModeContainer.rerenderEditView();
        if (isFitZoom === true) {
          updateSlideSize(false);
        } else {
          updateSlideSize(false);
        }
      }
    },
  });

  useLayoutEffect(() => {
    updateSlideSize(true);
  }, [calculateContentsSizeRef.current]);

  return {
    contentsWrapperRef,
    contentsRef,
    slideBackgroundRef,
  };
};

export default useSlideSize;
