import useCursorStyleComponent from 'hook/component/frame/style/cursor/useCursorStyleComponent';
import React from 'react';
import { ICursorInfo } from 'types/common/cursor/CursorTypes';

interface Props {
  cursorInfo: ICursorInfo;
}

const CursorStyleComponent = ({ cursorInfo }: Props): React.JSX.Element => {
  const { cursorStyleString } = useCursorStyleComponent(cursorInfo);
  if (!cursorStyleString) {
    return <></>;
  }

  return <style>{cursorStyleString}</style>;
};

export default CursorStyleComponent;
