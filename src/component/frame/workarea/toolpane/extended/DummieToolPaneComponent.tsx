import React from 'react';
import { ResourceEnum } from 'types/resource/ResourceEnum';
import ToolPaneComponent from '../ToolPaneComponent';

const DummieToolPaneComponent = (): React.JSX.Element => {
  return <ToolPaneComponent label={ResourceEnum.TXT_DUMMIE_TOOLPANE_TITLE} />;
};

export default DummieToolPaneComponent;
