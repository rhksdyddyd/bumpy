/**
 * react에서 list 형태의 children 구성 시 부여하는 enum 입니다.
 * ribbon control과 같이 형태, 갯수가 정적으로 고정 된 경우 부여합니다.
 * ReactKeyEnum을 제거하고, ribbon data를 구성하는 시점에
 * 동적으로 0부터의 숫자를 부여하는 방식(한번 부여하면 변경되지 않는)으로 변경 할 예정입니다.
 */
export enum ReactKeyEnum {
  INVALID = 0,
  RIBBON_GROUP_INSERT_SHAPE,
  RIBBON_GALLERY_INSERT_SHAPE,
  RIBBON_GALLERY_INSERT_SHAPE_GROUP_RECT,
  RIBBON_GALLERY_INSERT_SHAPE_GROUP_RECT_ITEM_RECT,
  RIBBON_GALLERY_INSERT_SHAPE_GROUP_RECT_ITEM_DIAGONAL_RECT,
}
