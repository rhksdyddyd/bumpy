import React from 'react';
import classNames from 'classnames';
import useAppAreaProxyCursorStyle from 'hook/component/frame/mainpage/proxylayer/apparea/useAppAreaProxyCursorStyle';

import styles from 'scss/component/frame/mainpage/proxylayer/apparea/AppAreaProxyLayer.module.scss';

const AppAreaEventBlockComponent = (): React.JSX.Element => {
  const { appAreaCursorStyle } = useAppAreaProxyCursorStyle();

  return (
    <div
      aria-hidden
      className={classNames(styles.container, styles.block_event)}
      style={{
        cursor: appAreaCursorStyle,
      }}
    />
  );
};

export default AppAreaEventBlockComponent;
