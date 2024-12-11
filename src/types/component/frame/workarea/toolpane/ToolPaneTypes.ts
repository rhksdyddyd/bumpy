import { ResourceEnum } from 'types/resource/ResourceEnum';

export interface ToolPaneProps {
  label: ResourceEnum;
  children?: React.ReactNode;
}

export interface ToolPaneTitleProps {
  label: ResourceEnum;
  onCloseIconClick: () => void;
}
