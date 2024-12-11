import classNames from 'classnames';
import React from 'react';
import styles from 'scss/component/frame/workarea/WorkArea.module.scss';
import ContentComponent from './content/ContentComponent';
import ToolPaneWrapperComponent from './toolpane/ToolPaneWrapperComponent';

/**
 * WorkArea를 render 하는 component 입니다.
 */
const WorkAreaComponent = (): React.JSX.Element => {
  return (
    <div className={classNames(styles.container)}>
      <ContentComponent />
      <ToolPaneWrapperComponent />
    </div>
  );
};

export default WorkAreaComponent;
