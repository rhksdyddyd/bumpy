import React from 'react';
import { IControlProps } from 'types/component/frame/control/ControlTypes';
import RibbonLabelComponent from 'component/frame/control/label/RibbonLabelComponent';
import { ControlSubTypeEnum } from 'types/component/frame/control/ControlSubTypeEnum';

import styles from 'scss/component/frame/control/gallery/RibbonGalleryItem.module.scss';

/**
 * RibbonGallery 내부의 item을 생성하는 component 입니다.
 *
 * @param param0 IControlProps item 세부 정보
 */
const RibbonGalleryItemComponent = ({ attr, eventhandler }: IControlProps): React.JSX.Element => {
  return (
    <RibbonLabelComponent
      attr={{ ...attr, subType: ControlSubTypeEnum.GI1, className: styles.galleryItem }}
      eventhandler={eventhandler}
    />
  );
};

export default RibbonGalleryItemComponent;
