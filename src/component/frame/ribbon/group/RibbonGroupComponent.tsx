import React from 'react';
import classNames from 'classnames';
import { IControlInfo, IControlProps } from 'types/component/frame/control/ControlTypes';
import WithControlHandlerComponent from 'component/frame/controlhandler/WithControlHandlerComponent';
import RibbonGroupLabelAreaComponent from 'component/frame/ribbon/group/RibbonGroupLabelAreaComponent';

import styles from 'scss/component/frame/ribbon/group/RibbonGroup.module.scss';

/**
 * Ribbon 내부에 실질적인 control들을 자식으로 가지면 공통된 style을 부여하는 component 입니다.
 *
 * @param param0 controlProps, RibbonGroup의 정보
 */
const RibbonGroupComponent = ({ attr, subControlInfos }: IControlProps): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <div
        className={classNames({
          [styles[attr?.subType ?? '']]: attr?.subType,
          [`${attr?.className}`]: attr?.className,
        })}
      >
        {subControlInfos !== undefined &&
          subControlInfos.map((controlInfo: IControlInfo) => {
            return (
              <div
                key={attr.reactKey}
                className={classNames({
                  [styles.item]: true,
                  [styles[controlInfo.attr.subType ?? '']]: controlInfo.attr.subType,
                })}
              >
                <WithControlHandlerComponent controlInfo={controlInfo} />
              </div>
            );
          })}
      </div>
      <RibbonGroupLabelAreaComponent attr={attr} />
    </div>
  );
};
export default RibbonGroupComponent;
