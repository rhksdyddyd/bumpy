/**
 * control의 SubType을 구분하기 위하여 사용합니다.
 * 각 control component에서 subtype에 따라 다른 형태의 component를 반환하거나
 * 독특한 style을 적용하기 위하여 사용합니다.
 */
export enum ControlSubTypeEnum {
  INVALID = 'INVALID',
  RG1 = 'rg1', // RibbonGroup 중 하나
  GA1 = 'ga1', // RibbonGallery 중 하나
  GI1 = 'gi1', // RibbonGalleryItem 중 하나
}
