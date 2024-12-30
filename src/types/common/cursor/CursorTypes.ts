import { ResourceEnum } from 'types/resource/ResourceEnum';
import { IPoint } from '../geometry/GeometryTypes';

export const CursorType = {
  auto: 'auto',
  default: 'default',
  context_menu: 'context-menu',
  help: 'help',
  pointer: 'pointer',
  progress: 'progress',
  wait: 'wait',
  cell: 'cell',
  crosshair: 'crosshair',
  text: 'text',
  vertical_text: 'vertical-text',
  alias: 'alias',
  copy: 'copy',
  move: 'move',
  no_drop: 'no-drop',
  not_allowed: 'not-allowed',
  e_resize: 'e-resize',
  n_resize: 'n-resize',
  ne_resize: 'ne-resize',
  nw_resize: 'nw-resize',
  s_resize: 's-resize',
  se_resize: 'se-resize',
  sw_resize: 'sw-resize',
  w_resize: 'w-resize',
  ew_resize: 'ew-resize',
  ns_resize: 'ns-resize',
  nesw_resize: 'nesw-resize',
  nwse_resize: 'nwse-resize',
  col_resize: 'col-resize',
  row_resize: 'row-resize',
  all_scroll: 'all-scroll',
  zoom_in: 'zoom-in',
  zoom_out: 'zoom-out',
  grab: 'grab',
  grabbing: 'grabbing',
  img: 'img',
} as const;
export type CursorType = (typeof CursorType)[keyof typeof CursorType];

export interface ICursorInfo {
  cursorType: CursorType;
  className?: string;
  img?: ResourceEnum;
  fallbackCursor?: CursorType;
  position?: IPoint;
}

export const CLASSNAME_GRAPHIC_CURSOR_MOVE_HOVER = 'graphic_cursor_move_hover';
export const CLASSNAME_GRAPHIC_CURSOR_ROTATE_HOVER = 'graphic_cursor_rotate_hover';
