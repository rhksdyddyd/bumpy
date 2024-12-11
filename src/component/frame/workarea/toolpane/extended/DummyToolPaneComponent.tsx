import React from 'react';
import { ResourceEnum } from 'types/resource/ResourceEnum';
import ToolPaneComponent from '../ToolPaneComponent';

const DummyToolPaneComponent = (): React.JSX.Element => {
  return <ToolPaneComponent label={ResourceEnum.TXT_DUMMY_TOOLPANE_TITLE} />;
};

export default DummyToolPaneComponent;
