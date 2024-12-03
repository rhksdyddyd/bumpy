import ButtonBaseComponent from 'component/frame/control/button/base/ButtonBaseComponent';
import ButtonIconComponent from 'component/frame/control/button/base/ButtonBaseIconComponent';
import React from 'react';
import { IIconButtonProps } from 'types/component/frame/control/button/IconButtonTypes';

/**
 * button 태그를 가진 요소를 생성하는 component 입니다.
 * 내부에 ImgResComponent 를 가집니다.
 *
 * @param param0 IIconButtonProps IconButton 정보
 */
const IconButtonComponent = ({
  img,
  width,
  height,
  ...props
}: IIconButtonProps): React.JSX.Element => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ButtonBaseComponent {...props}>
      <ButtonIconComponent img={img} width={width} height={height} />
    </ButtonBaseComponent>
  );
};

export default IconButtonComponent;
