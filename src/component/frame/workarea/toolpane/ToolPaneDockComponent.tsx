import useAppStore from 'hook/store/useAppStore';
import React from 'react';
import {
  BasicToolPane,
  ToolPaneType,
} from 'types/store/container/ui/toolpane/ToolPaneContainerTypes';
import styles from 'scss/component/frame/workarea/toolpane/ToolPaneDock.module.scss';
import ToolPaneDockButtonComponent from './ToolPaneDockButtonComponent';

const ToolPaneDockComponent = (): React.JSX.Element => {
  const appStore = useAppStore();
  const toolPaneContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getUIContainer()
    .getToolPaneContainer();

  const isToolPaneOpened = toolPaneContainer.getIsToolPaneOpened();
  const toolPaneInfoList = toolPaneContainer.getToolPaneInfoList();
  const selectedToolPaneId = toolPaneContainer.getSelectedToolPaneId();

  const renderToolPaneDockComponent = (type: ToolPaneType) => {
    return toolPaneInfoList
      ?.filter(([, toolPaneInfo]) => {
        return toolPaneInfo?.type === type;
      })
      .map(([toolPaneId, toolPaneInfo]) => {
        if (toolPaneInfo === undefined) {
          return <></>;
        }

        const selected = toolPaneId === selectedToolPaneId && isToolPaneOpened;

        return (
          <ToolPaneDockButtonComponent
            img={toolPaneInfo.img}
            disabled={toolPaneInfo.disabled}
            selected={selected}
            onClick={() => {
              toolPaneContainer.onToolPaneDockButtonClicked(toolPaneId);
            }}
            key={`TOOLPANE_DOCK_BUTTON_${toolPaneId}`}
          />
        );
      });
  };

  return (
    <div className={styles.container} role="toolbar">
      {renderToolPaneDockComponent(BasicToolPane)}
    </div>
  );
};

export default ToolPaneDockComponent;
