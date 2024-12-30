import { CursorType, ICursorInfo } from 'types/common/cursor/CursorTypes';
import { useImageResourceToDataURLString } from 'hook/resource/useImgRes';

type Hook = (cursorInfo: ICursorInfo) => {
  cursorStyleString: Nullable<string>;
};

const useCursorStyleComponent: Hook = (cursorInfo: ICursorInfo) => {
  const imageURL = useImageResourceToDataURLString({
    img: cursorInfo?.img,
  });

  const cursorPosition =
    cursorInfo.cursorType === 'img' && cursorInfo.position !== undefined
      ? `${cursorInfo.position.x} ${cursorInfo.position.y}`
      : '';

  const cursorStyle =
    cursorInfo.cursorType === CursorType.img
      ? `${imageURL} ${cursorPosition}, auto`
      : cursorInfo.cursorType;

  const cursorStyleString =
    cursorStyle !== undefined ? `.${cursorInfo.className} { cursor: ${cursorStyle}}` : undefined;

  return {
    cursorStyleString,
  };
};

export default useCursorStyleComponent;
