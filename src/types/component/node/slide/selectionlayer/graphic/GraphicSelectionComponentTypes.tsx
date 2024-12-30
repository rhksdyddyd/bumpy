import GraphicModel from 'model/node/graphic/GraphicModel';

export interface GraphicSelectionComponentProps {
  graphicModel: GraphicModel;
  isDirectlySelected: boolean;
}

export const SELECTION_DEFAULT_MARGIN = 30;
export const SELECTION_GROUP_EXTRA_MARGIN = 6;

export const ROTATION_HANDLE_SIZE = 5;
export const ROTATION_HANDLE_LINE_LENGTH = 15;
export const ROTATION_HANDLE_EVENT_SIZE = 10;

export const SELECTION_HANDLE_SIZE = 7;
