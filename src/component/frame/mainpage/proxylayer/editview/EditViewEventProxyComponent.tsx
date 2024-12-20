import React from 'react';
import classNames from 'classnames';
import useEditViewProxyLayer from 'hook/component/frame/mainpage/proxylayer/editview/useEditViewProxyLayer';

import styles from 'scss/component/frame/mainpage/proxylayer/editview/EditViewProxyLayer.module.scss';
import useEditViewProxyEventListener from 'hook/component/frame/mainpage/proxylayer/editview/useEditViewProxyEventListener';

const EditViewEventProxyComponent = (): React.JSX.Element => {
  const { editViewProxyLayerRef, editViewRectInfo } = useEditViewProxyLayer();
  const { handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave } =
    useEditViewProxyEventListener();

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
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default EditViewEventProxyComponent;
