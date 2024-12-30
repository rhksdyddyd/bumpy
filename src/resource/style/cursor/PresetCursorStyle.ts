import {
  CLASSNAME_GRAPHIC_CURSOR_MOVE_HOVER,
  CLASSNAME_GRAPHIC_CURSOR_ROTATE_HOVER,
  ICursorInfo,
} from 'types/common/cursor/CursorTypes';
import { ResourceEnum } from 'types/resource/ResourceEnum';

export const PresetCursorInfoList: Array<ICursorInfo> = [
  {
    className: CLASSNAME_GRAPHIC_CURSOR_MOVE_HOVER,
    cursorType: 'img',
    img: ResourceEnum.IMG_CURSOR_MOVE_HOVER,
    position: { x: 12, y: 12 },
  },
  {
    className: CLASSNAME_GRAPHIC_CURSOR_ROTATE_HOVER,
    cursorType: 'img',
    img: ResourceEnum.IMG_CURSOR_ROTATE_HOVER,
    position: { x: 12, y: 12 },
  },
];
