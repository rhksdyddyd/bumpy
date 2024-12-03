import classNames from 'classnames';
import ImgResComponent from 'component/frame/control/resource/ImgResComponent';
import React from 'react';
import { IIconProps } from 'types/component/frame/control/button/IconTypes';

import styles from 'scss/component/frame/control/button/Icon.module.scss';

/**
 * 이미지만 가지는 button을 생성하는 component 입니다.
 *
 * @param param0 IIconProps Icon 생성 정ㅂ
 */
const IconComponent = ({ attr, children, eventhandler }: IIconProps): React.JSX.Element => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={classNames(styles.icon, attr?.className)}
      onClick={eventhandler?.onClick}
      onMouseEnter={eventhandler?.onMouseEnter}
      onMouseLeave={eventhandler?.onMouseLeave}
      onKeyDown={eventhandler?.onKeyDown}
    >
      <ImgResComponent img={attr?.img} width={attr?.width} height={attr?.height} />
      {children}
    </div>
  );
};

export default IconComponent;
