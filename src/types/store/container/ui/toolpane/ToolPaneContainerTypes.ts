import { ResourceEnum } from 'types/resource/ResourceEnum';
import { ToolPaneTypeEnum } from './ToolPaneTypeEnum';

export const BasicToolPane = true;

export const ContextualToolPane = false;

export type ToolPaneType = typeof BasicToolPane | typeof ContextualToolPane;

export type ToolPaneInfo = {
  img: ResourceEnum;
  type: ToolPaneType;
  content?: () => React.JSX.Element;
  disabled?: boolean;
};

export type ToolPaneInfoMap = Map<ToolPaneTypeEnum, ToolPaneInfo>;
