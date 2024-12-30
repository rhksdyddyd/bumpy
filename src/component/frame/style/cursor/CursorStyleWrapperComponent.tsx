import React from 'react';
import { PresetCursorInfoList } from 'resource/style/cursor/PresetCursorStyle';
import CursorStyleComponent from './CursorStyleComponent';

const CursorStyleWrapperComponent = (): React.JSX.Element => {
  return (
    <>
      {PresetCursorInfoList.map(cursorInfo => {
        return <CursorStyleComponent key={cursorInfo.className} cursorInfo={cursorInfo} />;
      })}
    </>
  );
};

export default CursorStyleWrapperComponent;
