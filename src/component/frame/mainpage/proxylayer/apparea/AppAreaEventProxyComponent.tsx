import React from 'react';
import classNames from 'classnames';
import useAppAreaProxyEventListener from 'hook/component/frame/mainpage/proxylayer/apparea/useAppAreaProxyEventListener';

import styles from 'scss/component/frame/mainpage/proxylayer/apparea/AppAreaProxyLayer.module.scss';

const AppAreaEventProxyComponent = (): React.JSX.Element => {
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

  return (
    <div
      aria-hidden
      ref={appAreaProxyLayerRef}
      className={classNames(styles.container)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseOut={handleMouseOut}
      onBlur={handleBlur}
    />
  );
};

export default AppAreaEventProxyComponent;
