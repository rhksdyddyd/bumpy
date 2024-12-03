/**
 * control의 종류를 구분하기 위한 enum 입니다.
 * IControlInfos에 포함되어 있고, getControl 함수 등에서 사용합니다.
 */
export enum ControlTypeEnum {
  INVALID = 0,
  RIBBON_GROUP, // top level
  RIBBON_GALLERY,
  RIBBON_GALLERY_ITEM,
  RIBBON_LABEL,
}
