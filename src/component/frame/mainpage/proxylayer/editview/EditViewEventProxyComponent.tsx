import React from 'react';
import classNames from 'classnames';
import useEditViewProxyLayer from 'hook/component/frame/mainpage/proxylayer/editview/useEditViewProxyLayer';
import useEditViewProxyEventListener from 'hook/component/frame/mainpage/proxylayer/editview/useEditViewProxyEventListener';
import useAppStore from 'hook/store/useAppStore';
import useEditViewProxyCursorStyle from 'hook/component/frame/mainpage/proxylayer/editview/useEditViewProxyCursorStyle';

import styles from 'scss/component/frame/mainpage/proxylayer/editview/EditViewProxyLayer.module.scss';

const EditViewEventProxyComponent = (): React.JSX.Element => {
  const appStore = useAppStore();
  const proxyLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();
  const isEventProxyEnabled = proxyLayerInfoContainer.getIsEditViewEventProxyEnabled();

  const { editViewProxyLayerRef, editViewRectInfo } = useEditViewProxyLayer();
  const { handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave } =
    useEditViewProxyEventListener();
  const { editViewCursorStyle } = useEditViewProxyCursorStyle();

  return (
    <div
      aria-hidden
      ref={editViewProxyLayerRef}
      className={classNames(styles.container)}
      style={{
        left: `${editViewRectInfo.left}px`,
        top: `${editViewRectInfo.top}px`,
        width: `${editViewRectInfo.width}px`,
        height: `${editViewRectInfo.height}px`,
        cursor: editViewCursorStyle,
      }}
      onMouseDown={isEventProxyEnabled ? handleMouseDown : undefined}
      onMouseUp={isEventProxyEnabled ? handleMouseUp : undefined}
      onMouseMove={isEventProxyEnabled ? handleMouseMove : undefined}
      onMouseLeave={isEventProxyEnabled ? handleMouseLeave : undefined}
    />
  );
};

export default EditViewEventProxyComponent;
