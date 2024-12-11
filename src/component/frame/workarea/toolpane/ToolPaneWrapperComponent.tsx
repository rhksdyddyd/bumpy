import useAppStore from 'hook/store/useAppStore';
import useRerender from 'hook/store/useRerender';
import React, { forwardRef, useEffect } from 'react';
import styles from 'scss/component/frame/workarea/toolpane/ToolPaneWrapper.module.scss';
import ToolPaneDockComponent from './ToolPaneDockComponent';

const ToolPaneWrapperComponent = forwardRef<HTMLDivElement>((_, ref): React.JSX.Element => {
  const { triggerRerender } = useRerender();
  const appStore = useAppStore();
  const toolPaneContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getUIContainer()
    .getToolPaneContainer();

  useEffect(() => {
    toolPaneContainer.setRerenderToolPaneWrapperFunction(triggerRerender);
  }, []);

  const selectedToolPaneId = toolPaneContainer.getSelectedToolPaneId();
  const selectedToolPaneInfo = toolPaneContainer.getToolPaneInfo(selectedToolPaneId);
  const isToolPaneOpened = toolPaneContainer.getIsToolPaneOpened();

  return (
    <div
      className={styles.container}
      ref={ref}
      role="toolbar"
      onMouseDownCapture={() => {
        appStore.getAppContext().getEditableContext().setMouseLButtonPressed(false);
      }}
    >
      <ToolPaneDockComponent />
      {isToolPaneOpened && selectedToolPaneInfo?.content && selectedToolPaneInfo?.content()}
    </div>
  );
});

export default ToolPaneWrapperComponent;
