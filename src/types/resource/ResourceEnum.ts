/**
 * resource 를 구분하기 위한 enum 입니다.
 * resoureId: value 가 json이 되어야 하기 때문에,
 * ResourceEnum은 string이 되어야 합니다.
 */
export enum ResourceEnum {
  // txt
  TXT_GROUP_INSERT_SHAPE = 'TXT_GROUP_INSERT_SHAPE',
  TXT_SHAPE_INSERT_GALLERY_RECT = 'TXT_SHAPE_INSERT_GALLERY_RECT',
  TXT_DUMMY_TOOLPANE_TITLE = 'TXT_DUMMY_TOOLPANE_TITLE',
  TXT_DUMMIE_TOOLPANE_TITLE = 'TXT_DUMMIE_TOOLPANE_TITLE',
  // tooltip
  TIP_INSERT_SHAPE_RECT = 'TIP_INSERT_SHAPE_RECT',
  TIP_INSERT_SHAPE_DIAGONAL_RECT = 'TIP_INSERT_SHAPE_DIAGONAL_RECT',
  // img
  IMG_INSERT_SHAPE_RECT = 'IMG_INSERT_SHAPE_RECT',
  IMG_INSERT_SHAPE_DIAGONAL_RECT = 'IMG_INSERT_SHAPE_DIAGONAL_RECT',
  IMG_RIBBON_GALLERY_MORE_BUTTON = 'IMG_RIBBON_GALLERY_MORE_BUTTON',
  IMG_ARROW_DOWN = 'IMG_ARROW_DOWN',
  IMG_TOOLPANE_NOTICE = 'IMG_TOOLPANE_NOTICE',
  IMG_TOOLPANE_CLOSE = 'IMG_TOOLPANE_CLOSE',
  IMG_TOOLPANE_DOCK_DUMMY = 'IMG_TOOLPANE_DOCK_DUMMY',
  IMG_TOOLPANE_DOCK_DUMMIE = 'IMG_TOOLPANE_DOCK_DUMMIE',
  IMG_CURSOR_ROTATE = 'IMG_CURSOR_ROTATE',
  IMG_CURSOR_ROTATE_HOVER = 'IMG_CURSOR_ROTATE_HOVER',
  IMG_CURSOR_MOVE_HOVER = 'IMG_CURSOR_MOVE_HOVER',
}
