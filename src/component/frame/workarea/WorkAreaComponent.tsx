import classNames from 'classnames';
import React from 'react';

import styles from 'scss/component/frame/workarea/WorkArea.module.scss';

/**
 * WorkArea를 render 하는 component 입니다.
 */
const WorkAreaComponent = (): React.JSX.Element => {
  return <div className={classNames(styles.container)} />;
};

export default WorkAreaComponent;
