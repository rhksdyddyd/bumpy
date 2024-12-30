import React from 'react';
import classNames from 'classnames';
import useAppAreaProxyEventListener from 'hook/component/frame/mainpage/proxylayer/apparea/useAppAreaProxyEventListener';

import styles from 'scss/component/frame/mainpage/proxylayer/apparea/AppAreaProxyLayer.module.scss';
import useAppStore from 'hook/store/useAppStore';
import useAppAreaProxyCursorStyle from 'hook/component/frame/mainpage/proxylayer/apparea/useAppAreaProxyCursorStyle';

const AppAreaEventProxyComponent = (): React.JSX.Element => {
  const appStore = useAppStore();
  const proxyLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();
  const isEventProxyEnabled = proxyLayerInfoContainer.getIsAppAreaEventProxyEnabled();

  const {
    appAreaProxyLayerRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseOut,
    handleBlur,
  } = useAppAreaProxyEventListener();

  const { appAreaCursorStyle } = useAppAreaProxyCursorStyle();

  return (
    <div
      aria-hidden
      ref={appAreaProxyLayerRef}
      className={classNames(styles.container)}
      style={{
        cursor: appAreaCursorStyle,
      }}
      onMouseDown={isEventProxyEnabled ? handleMouseDown : undefined}
      onMouseUp={isEventProxyEnabled ? handleMouseUp : undefined}
      onMouseMove={isEventProxyEnabled ? handleMouseMove : undefined}
      onMouseEnter={isEventProxyEnabled ? handleMouseEnter : undefined}
      onMouseLeave={isEventProxyEnabled ? handleMouseLeave : undefined}
      onMouseOut={isEventProxyEnabled ? handleMouseOut : undefined}
      onBlur={isEventProxyEnabled ? handleBlur : undefined}
    />
  );
};

export default AppAreaEventProxyComponent;
