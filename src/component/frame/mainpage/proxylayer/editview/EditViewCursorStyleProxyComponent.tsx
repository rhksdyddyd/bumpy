import React from 'react';
import classNames from 'classnames';
import useEditViewProxyLayer from 'hook/component/frame/mainpage/proxylayer/editview/useEditViewProxyLayer';
import useEditViewProxyCursorStyle from 'hook/component/frame/mainpage/proxylayer/editview/useEditViewProxyCursorStyle';

import styles from 'scss/component/frame/mainpage/proxylayer/editview/EditViewProxyLayer.module.scss';

const EditViewCursorStyleProxyComponent = (): React.JSX.Element => {
  const { editViewProxyLayerRef, editViewRectInfo } = useEditViewProxyLayer();
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
    />
  );
};

export default EditViewCursorStyleProxyComponent;
