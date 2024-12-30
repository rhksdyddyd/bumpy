import GraphicModel from 'model/node/graphic/GraphicModel';
import EventRectBuilder from 'model/node/graphic/info/path/EventRectBuilder';
import { IPoint, ISize } from 'types/common/geometry/GeometryTypes';
import { IPath } from 'types/model/node/graphic/GraphicTypes';
import { GraphicEditingHandleEnum } from 'types/store/container/edit/GraphicEditingHandleEnum';
import {
  getNoneEditingDisplayedFlipV,
  getNoneEditingDisplayedPosition,
  getNoneEditingDisplayedRotation,
  getNoneEditingDisplayedSize,
} from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';

type Hook = (
  graphicModel: GraphicModel,
  margin: number
) => {
  position: IPoint;
  size: ISize;
  rotation: number;
  rotationTransform: string;
  flipTransform: string;
  editingHandleList: GraphicEditingHandleEnum[];
  pathList: IPath[];
};

const useGraphicSelectionComponent: Hook = (graphicModel: GraphicModel, pathMargin: number) => {
  const eventPathbuilder = new EventRectBuilder();

  const position = getNoneEditingDisplayedPosition(graphicModel);
  const size = getNoneEditingDisplayedSize(graphicModel);
  const rotation = getNoneEditingDisplayedRotation(graphicModel);
  const pathList = eventPathbuilder.build({
    x: 0 - pathMargin,
    y: 0 - pathMargin,
    width: size.width + 2 * pathMargin,
    height: size.height + 2 * pathMargin,
  });
  const rotationTransform = `rotate(${rotation}deg)`;
  const flipTransform = getNoneEditingDisplayedFlipV(graphicModel) === true ? 'scale(1, -1)' : '';
  const editingHandleList = [
    GraphicEditingHandleEnum.LEFT_TOP,
    GraphicEditingHandleEnum.TOP,
    GraphicEditingHandleEnum.RIGHT_TOP,
    GraphicEditingHandleEnum.LEFT,
    GraphicEditingHandleEnum.RIGHT,
    GraphicEditingHandleEnum.LEFT_BOTTOM,
    GraphicEditingHandleEnum.BOTTOM,
    GraphicEditingHandleEnum.RIGHT_BOTTOM,
  ];

  return {
    position,
    size,
    rotation,
    rotationTransform,
    flipTransform,
    editingHandleList,
    pathList,
  };
};

export default useGraphicSelectionComponent;
