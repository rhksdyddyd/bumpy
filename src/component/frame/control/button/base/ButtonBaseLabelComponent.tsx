import useTextRes from 'hook/resource/useTextRes';
import React from 'react';
import { IButtonBaseLabelProps } from 'types/component/frame/control/button/ButtonBaseTypes';

/**
 * ButtonBaseComponent와 함께 사용 할 label component를 생성합니다.
 *
 * @param param0 IButtonBaseLabelProps label 정보
 */
const ButtonBaseLabelComponent = ({
  label,
  className,
}: IButtonBaseLabelProps): React.JSX.Element => {
  const text = useTextRes(label);
  return <span className={className}>{text}</span>;
};

export default ButtonBaseLabelComponent;
