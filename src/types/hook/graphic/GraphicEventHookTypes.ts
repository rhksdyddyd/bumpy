import { GraphicEditingHandleEnum } from 'types/store/container/edit/GraphicEditingHandleEnum';

export type GraphicMouseEvent = React.MouseEvent<HTMLElement | SVGElement | SVGPathElement>;

export type GraphicMouseHandlerType = (e: GraphicMouseEvent, index?: number) => void;

export type EditingHandleMouseHandlerType = Nullable<
  (e: GraphicMouseEvent, editingHandle: GraphicEditingHandleEnum, cursor: string) => void
>;
