import React, { PropsWithChildren } from 'react';
import { IButtonBaseProps } from 'types/component/frame/control/button/ButtonBaseTypes';

/**
 * button component를 생성합니다.
 *
 * @param IButtonBaseProps Button 관련 정보
 */
const ButtonBaseComponent = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<IButtonBaseProps>
>(
  (
    { children, selected, ...props }: PropsWithChildren<IButtonBaseProps>,
    ref
  ): React.JSX.Element => {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <button type="button" aria-pressed={selected} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

export default ButtonBaseComponent;
