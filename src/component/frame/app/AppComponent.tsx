import React from 'react';
import styles from 'scss/component/frame/app/App.module.scss';
import classNames from 'classnames';
import useShortcut from 'hook/event/shortcut/useShortcut';
import MainPageComponent from '../mainpage/MainPageComponent';
import CursorStyleWrapperComponent from '../style/cursor/CursorStyleWrapperComponent';

/**
 * main page를 rendering 하는 최상위 component 입니다.
 */
const AppComponent = (): React.JSX.Element => {
  const { shortcutHandler, clearKeyHandler } = useShortcut();
  return (
    <div
      id="app_root"
      role="none"
      className={classNames(styles.container)}
      onKeyDownCapture={shortcutHandler}
      onKeyUp={clearKeyHandler}
    >
      <CursorStyleWrapperComponent />
      <MainPageComponent />
    </div>
  );
};

export default AppComponent;
