import ImgResComponent from 'component/frame/control/resource/ImgResComponent';
import React from 'react';
import { IButtonBaseIconProps } from 'types/component/frame/control/button/ButtonBaseTypes';

/**
 * ButtonBaseComponent와 함께 사용 할 ImgResComponent를 생성합니다<div className=""></div>
 *
 * @param props IButtonBaseIconProps icon 생성을 위한 정보
 */
const ButtonBaseIconComponent = (props: IButtonBaseIconProps): React.JSX.Element => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ImgResComponent {...props} />;
};

export default ButtonBaseIconComponent;
