import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ToolPaneProps } from 'types/component/frame/workarea/toolpane/ToolPaneTypes';
import useAppStore from 'hook/store/useAppStore';
import styles from 'scss/component/frame/workarea/toolpane/ToolPane.module.scss';
import ToolPaneTitleComponent from './ToolPaneTitleComponent';

const ToolPaneComponent = ({ label, children }: ToolPaneProps): React.JSX.Element => {
  const appStore = useAppStore();
  const toolPaneContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getUIContainer()
    .getToolPaneContainer();

  const ref = useRef<HTMLDivElement>(null);

  const closeToolPane = () => {
    if (ref.current !== null) {
      (ref.current as HTMLDivElement).className = '';
      // BROWSER의 REFLOW를 강제로 하기 위함
      // eslint-disable-next-line babel/no-unused-expressions
      ref.current.offsetWidth;
      (ref.current as HTMLDivElement).className = classNames(styles.toolPane, styles.close);
    }
  };

  useEffect(() => {
    toolPaneContainer.setCloseToolPaneFunction(() => {
      closeToolPane();
    });
  }, []);

  const isOpenWithAnimation = toolPaneContainer.getIsOpenWithAnimation();

  return (
    <div ref={ref} className={classNames(styles.toolPane, isOpenWithAnimation && styles.open)}>
      <ToolPaneTitleComponent
        label={label}
        onCloseIconClick={() => {
          closeToolPane();
        }}
      />
      {children}
    </div>
  );
};

export default ToolPaneComponent;
