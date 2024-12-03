import RibbonGalleryComponent from 'component/frame/control/gallery/RibbonGalleryComponent';
import RibbonGalleryItemComponent from 'component/frame/control/gallery/RibbonGalleryItemComponent';
import RibbonLabelComponent from 'component/frame/control/label/RibbonLabelComponent';
import RibbonGroupComponent from 'component/frame/ribbon/group/RibbonGroupComponent';
import { ControlTypeEnum } from 'types/component/frame/control/ControlTypeEnum';
import { ControlType } from 'types/component/frame/control/ControlTypes';

/**
 * ControlType에 따른 Control을 관리하는 map 입니다.
 */
const controlMap: Map<ControlTypeEnum, ControlType> = new Map([
  [ControlTypeEnum.RIBBON_GROUP, RibbonGroupComponent],
  [ControlTypeEnum.RIBBON_GALLERY, RibbonGalleryComponent],
  [ControlTypeEnum.RIBBON_GALLERY_ITEM, RibbonGalleryItemComponent],
  [ControlTypeEnum.RIBBON_LABEL, RibbonLabelComponent],
]);

/**
 * controlType에 해당하는 control을 반환합니다.
 *
 * @param controlType 원하는 control을 상징하는 ControlTypeEnum
 * @returns controlType에 해당하는 control
 */
const getControl = (controlType: ControlTypeEnum): ControlType => {
  return controlMap.get(controlType) as ControlType;
};

export default getControl;
