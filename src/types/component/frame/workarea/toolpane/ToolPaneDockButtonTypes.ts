import { ResourceEnum } from 'types/resource/ResourceEnum';

export interface ToolPaneDockButtonProps {
  img: ResourceEnum;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}
