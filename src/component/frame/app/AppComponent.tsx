import React from 'react';
import styles from 'scss/component/frame/app/App.module.scss';
import classNames from 'classnames';
import MainPageComponent from '../mainpage/MainPageComponent';
import CursorStyleWrapperComponent from '../style/cursor/CursorStyleWrapperComponent';

/**
 * main page를 rendering 하는 최상위 component 입니다.
 */
const AppComponent = (): React.JSX.Element => {
  return (
    <div id="app_root" className={classNames(styles.container)}>
      <CursorStyleWrapperComponent />
      <MainPageComponent />
    </div>
  );
};

export default AppComponent;
