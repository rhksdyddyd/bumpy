import { useImageResourceToDataURLString } from 'hook/resource/useImgRes';
import { CursorType, ICursorInfo } from 'types/common/cursor/CursorTypes';

type Hook = (cursorInfo: Nullable<ICursorInfo>) => {
  cursorStyle: Nullable<string>;
};

const useCursorStyle: Hook = (cursorInfo: Nullable<ICursorInfo>) => {
  const cursorImage = useImageResourceToDataURLString({
    img: cursorInfo?.img,
  });

  const cursorPosition =
    cursorInfo !== undefined &&
    cursorInfo.cursorType === CursorType.img &&
    cursorInfo.position !== undefined
      ? `${cursorInfo.position.x} ${cursorInfo.position.y}`
      : '';

  const cursorStyle =
    cursorInfo !== undefined && cursorInfo.cursorType === CursorType.img
      ? `${cursorImage} ${cursorPosition}, ${cursorInfo.fallbackCursor ?? CursorType.auto}`
      : cursorInfo?.cursorType;

  return {
    cursorStyle,
  };
};

export default useCursorStyle;
