import React from 'react';
import { IControlProps } from 'types/component/frame/control/ControlTypes';
import useTextRes from 'hook/resource/useTextRes';

import styles from 'scss/component/frame/ribbon/group/RibbonGroupLabelArea.module.scss';

/**
 * RibbonGroup 하단의 설명을 표시하는 label 입니다.
 *
 * @param param0 controlProps, RibbonGroup의 정보
 */
const RibbonGroupLabelAreaComponent = ({ attr }: IControlProps): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <span>{useTextRes(attr?.label)}</span>
    </div>
  );
};

export default RibbonGroupLabelAreaComponent;
