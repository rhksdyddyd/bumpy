import classNames from 'classnames';
import RibbonComponent from 'component/frame/ribbon/RibbonComponent';
import WorkAreaComponent from 'component/frame/workarea/WorkAreaComponent';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInit from 'util/i18n/I18nInit';

import styles from 'scss/component/frame/mainpage/MainPage.module.scss';

/**
 * #root 아래에 있는 가장 최 상단 component 입니다.
 * i18n을 init 합니다.
 */
const MainPageComponent = (): React.JSX.Element => {
  const i18n = i18nInit();

  return (
    <I18nextProvider i18n={i18n}>
      <div className={classNames(styles.container)}>
        <RibbonComponent />
        <WorkAreaComponent />
      </div>
    </I18nextProvider>
  );
};

export default MainPageComponent;
