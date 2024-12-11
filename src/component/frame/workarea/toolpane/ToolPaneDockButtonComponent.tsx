import React from 'react';
import ButtonBaseComponent from 'component/frame/control/button/base/ButtonBaseComponent';
import ButtonBaseIconComponent from 'component/frame/control/button/base/ButtonBaseIconComponent';

import styles from 'scss/component/frame/workarea/toolpane/ToolPaneDockButton.module.scss';
import { ToolPaneDockButtonProps } from 'types/component/frame/workarea/toolpane/ToolPaneDockButtonTypes';

const ToolPaneDockButtonComponent = ({
  img,
  selected,
  disabled,
  onClick,
}: ToolPaneDockButtonProps): React.JSX.Element => {
  return (
    <ButtonBaseComponent
      className={styles.button}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <ButtonBaseIconComponent img={img} width="24px" height="24px" />
    </ButtonBaseComponent>
  );
};

export default ToolPaneDockButtonComponent;
