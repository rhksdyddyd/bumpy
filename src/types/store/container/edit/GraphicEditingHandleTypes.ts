import { GraphicEditingHandleEnum } from './GraphicEditingHandleEnum';

export interface GraphicEditingHandleProps {
  handle: GraphicEditingHandleEnum;
  margin: number;
  objectWidth: number;
  objectHeight: number;
  objectRotation: number;
}

export interface GraphicEditingHandleInfo {
  cursor: string;
  position: { left: number; top: number };
}
