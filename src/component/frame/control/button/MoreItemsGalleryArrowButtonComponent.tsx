import React from 'react';
import classNames from 'classnames';
import { IControlProps } from 'types/component/frame/control/ControlTypes';
import IconButtonComponent from 'component/frame/control/button/IconButtonComponent';
import { ResourceEnum } from 'types/resource/ResourceEnum';

import styles from 'scss/component/frame/control/button/ArrowButton.module.scss';

/**
 * RibbonGallery의 dropdown 확장 버튼을 생성하는 component 입니다.
 *
 * @param param0 IControlProps control 관련 정보
 */
const MoreItemsGalleryArrowButtonComponent = ({
  attr,
  eventhandler,
}: IControlProps): React.JSX.Element => {
  return (
    <IconButtonComponent
      className={classNames({
        [styles.container]: true,
        [styles.more]: true,
        [styles.disabled]: attr?.disabled,
        [`${attr?.className}`]: attr?.className,
      })}
      img={ResourceEnum.IMG_RIBBON_GALLERY_MORE_BUTTON}
      width="7px"
      height="9px"
      disabled={attr.disabled}
      onClick={eventhandler?.onClick}
      onMouseEnter={eventhandler?.onMouseEnter}
      onMouseLeave={eventhandler?.onMouseLeave}
    />
  );
};

export default MoreItemsGalleryArrowButtonComponent;
