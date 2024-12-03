import React from 'react';
import classNames from 'classnames';
import { ILabelProps } from 'types/component/frame/control/label/LabelTypes';
import useTextRes from 'hook/resource/useTextRes';

/**
 * 주어진 resourceId를 기준으로 label을 생성합니다.
 */
const LabelComponent = ({ attr, eventhandler, children }: ILabelProps): React.JSX.Element => {
  const label = useTextRes(attr?.label);
  return (
    <label
      className={classNames({
        [`${attr?.className}`]: attr?.className,
      })}
      onMouseEnter={eventhandler?.onMouseEnter}
      htmlFor={attr?.htmlFor}
    >
      {label}
      {children}
    </label>
  );
};

export default LabelComponent;
