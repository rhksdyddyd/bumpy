import React from 'react';
import classNames from 'classnames';
import { ResourceEnum } from 'types/resource/ResourceEnum';
import { IArrowButtonProps } from 'types/component/frame/control/button/ArrowButtonTypes';
import IconButtonComponent from 'component/frame/control/button/IconButtonComponent';

import styles from 'scss/component/frame/control/button/ArrowButton.module.scss';

/**
 * 화살표 모양의 이미지를 포함하는 button을 생성합니다.
 *
 * @param param0 IArrowButtonProps ArrowButton 정보
 */
const ArrowButtonComponent = ({ attr, eventhandler }: IArrowButtonProps): React.JSX.Element => {
  return (
    <IconButtonComponent
      img={ResourceEnum.IMG_ARROW_DOWN}
      width={attr?.width}
      height={attr?.height}
      className={classNames({
        [styles.container]: true,
        [styles[attr?.arrowType ?? '']]: attr?.arrowType,
        [styles.disabled]: attr?.disabled,
        [`${attr?.className}`]: attr?.className,
      })}
      disabled={attr?.disabled}
      onClick={eventhandler?.onClick}
      onMouseEnter={eventhandler?.onMouseEnter}
      onMouseLeave={eventhandler?.onMouseLeave}
    />
  );
};

export default React.memo(ArrowButtonComponent);
