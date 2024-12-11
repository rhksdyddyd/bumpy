import IconButtonComponent from 'component/frame/control/button/IconButtonComponent';
import useTextRes from 'hook/resource/useTextRes';
import React from 'react';
import { ToolPaneTitleProps } from 'types/component/frame/workarea/toolpane/ToolPaneTypes';
import { ResourceEnum } from 'types/resource/ResourceEnum';

import styles from 'scss/component/frame/workarea/toolpane/ToolPaneTitle.module.scss';

const ToolPaneTitleComponent = ({
  label,
  onCloseIconClick,
}: ToolPaneTitleProps): React.JSX.Element => {
  const title = useTextRes(label);

  return (
    <div className={styles.title}>
      <span className={styles.label}>{title}</span>
      <IconButtonComponent
        className={styles.closeIcon}
        img={ResourceEnum.IMG_TOOLPANE_CLOSE}
        width="20px"
        height="20px"
        onClick={onCloseIconClick}
      />
    </div>
  );
};

export default ToolPaneTitleComponent;
