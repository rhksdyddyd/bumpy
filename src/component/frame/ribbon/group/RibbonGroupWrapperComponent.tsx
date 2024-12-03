import getControl from 'component/frame/control/getControl';
import React from 'react';
import { RibbonData } from 'resource/ribbon/RibbonData';
import { IControlInfo } from 'types/component/frame/control/ControlTypes';

import styles from 'scss/component/frame/ribbon/group/RibbonGroupWrapper.module.scss';

/**
 * RibbonComponent 바로 아래의 Component 입니다, 여러개의 RibbonGroup을 render 합니다.
 */
const RibbonGroupWrapperComponent: React.FC = () => {
  return (
    <div className={styles.container}>
      {RibbonData.map((controlInfo: IControlInfo) => {
        const Control = getControl(controlInfo.type);
        return (
          <Control
            key={controlInfo.attr.reactKey}
            attr={controlInfo.attr}
            subControlInfos={controlInfo.subControlInfos}
          />
        );
      })}
    </div>
  );
};

export default RibbonGroupWrapperComponent;
