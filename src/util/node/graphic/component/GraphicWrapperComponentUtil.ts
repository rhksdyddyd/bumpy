import * as math from 'mathjs';
import GraphicModel from 'model/node/graphic/GraphicModel';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import { IPoint, IResizeRatio, ISize } from 'types/common/geometry/GeometryTypes';
import { rotatePointAroundPivot } from 'util/coordinate/CoordinateUtil';
import {
  getDisplayedCenterCoordinate,
  getDisplayedFlipH,
  getDisplayedFlipV,
  getDisplayedPosition,
  getDisplayedRotation,
  getDisplayedSize,
} from '../coordinate/GraphicModelCoordinateUtil';
import { getParentGroup } from '../GraphicModelTreeNodeUtil';

export function getGraphicWrapperCoordinateStyle(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  isEditPreviewLayer: boolean
): React.CSSProperties {
  const coordinateStyle: React.CSSProperties = {};

  const { size, transformMatrix } = calculateDisplayedTransformMatrix(
    graphicEditInfoContainer,
    graphicModel,
    isEditPreviewLayer
  );

  coordinateStyle.transform = matrixToStyleString(transformMatrix);

  coordinateStyle.left = '0px';
  coordinateStyle.top = '0px';
  coordinateStyle.width = `${size.width}px`;
  coordinateStyle.height = `${size.height}px`;

  return coordinateStyle;
}

function calculateDisplayedTransformMatrix(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  isEditPreviewLayer: boolean
): { size: ISize; transformMatrix: math.Matrix } {
  let transformMatrix: math.Matrix;

  const targetPosition = getDisplayedPosition(
    graphicEditInfoContainer,
    graphicModel,
    isEditPreviewLayer
  );
  const targetSize = getDisplayedSize(graphicEditInfoContainer, graphicModel, isEditPreviewLayer);
  const targetFlipH = getDisplayedFlipH(graphicEditInfoContainer, graphicModel, isEditPreviewLayer);
  const targetFlipV = getDisplayedFlipV(graphicEditInfoContainer, graphicModel, isEditPreviewLayer);
  const targetScale: IResizeRatio = {
    widthRatio: targetFlipH ? -1 : 1,
    heightRatio: targetFlipV ? -1 : 1,
  };
  const targetRotation = getDisplayedRotation(
    graphicEditInfoContainer,
    graphicModel,
    isEditPreviewLayer
  );

  if (isEditPreviewLayer === true) {
    const targetMatrix = getTransformMatrix(targetPosition, targetScale, targetRotation);
    transformMatrix = targetMatrix;
  } else {
    const parentModel = getParentGroup(graphicModel);
    if (parentModel === undefined) {
      const targetMatrix = getTransformMatrix(targetPosition, targetScale, targetRotation);
      transformMatrix = targetMatrix;
    } else {
      const parentGroupSize = getDisplayedSize(
        graphicEditInfoContainer,
        parentModel,
        isEditPreviewLayer
      );
      const parentGroupFlipH = getDisplayedFlipH(
        graphicEditInfoContainer,
        parentModel,
        isEditPreviewLayer
      );
      const parentGroupFlipV = getDisplayedFlipV(
        graphicEditInfoContainer,
        parentModel,
        isEditPreviewLayer
      );
      const parentGroupScale: IResizeRatio = {
        widthRatio: parentGroupFlipH ? -1 : 1,
        heightRatio: parentGroupFlipV ? -1 : 1,
      };
      const parentGroupRotation = getDisplayedRotation(
        graphicEditInfoContainer,
        parentModel,
        isEditPreviewLayer
      );

      const parentGroupCenter = getDisplayedCenterCoordinate(
        graphicEditInfoContainer,
        parentModel,
        isEditPreviewLayer
      );
      const targetCenter = getDisplayedCenterCoordinate(
        graphicEditInfoContainer,
        graphicModel,
        isEditPreviewLayer
      );

      const lacalizedTargetCenter = rotatePointAroundPivot(
        targetCenter,
        parentGroupCenter,
        -parentGroupRotation
      );

      const distanceVector: IPoint = {
        x: lacalizedTargetCenter.x - parentGroupCenter.x,
        y: lacalizedTargetCenter.y - parentGroupCenter.y,
      };

      const scale: IResizeRatio = {
        widthRatio: graphicModel.getCoordinateInfo().getFlipH() === true ? -1 : 1,
        heightRatio: graphicModel.getCoordinateInfo().getFlipV() === true ? -1 : 1,
      };

      const translation: IPoint = {
        x:
          parentGroupSize.width / 2 -
          targetSize.width / 2 +
          distanceVector.x * parentGroupScale.widthRatio,
        y:
          parentGroupSize.height / 2 -
          targetSize.height / 2 +
          distanceVector.y * parentGroupScale.heightRatio,
      };

      transformMatrix = getTransformMatrix(
        translation,
        scale,
        graphicModel.getCoordinateInfo().getRotation()
      );
    }
  }

  return { size: targetSize, transformMatrix };
}

function getTransformMatrix(translate: IPoint, scale: IResizeRatio, rotation: number): math.Matrix {
  const cos = math.cos(math.unit(rotation, 'deg'));
  const sin = math.sin(math.unit(rotation, 'deg'));
  const rotationMatrix = math.matrix([
    [cos, -sin, 0],
    [sin, cos, 0],
    [0, 0, 1],
  ]);
  const translationMatrix = math.matrix([
    [1, 0, translate.x],
    [0, 1, translate.y],
    [0, 0, 1],
  ]);
  const scaleMatrix = math.matrix([
    [scale.widthRatio, 0, 0],
    [0, scale.heightRatio, 0],
    [0, 0, 1],
  ]);

  return math.multiply(translationMatrix, math.multiply(rotationMatrix, scaleMatrix));
}

function matrixToStyleString(matrix: math.Matrix): string {
  const a = matrix.get([0, 0]);
  const b = matrix.get([1, 0]);
  const c = matrix.get([0, 1]);
  const d = matrix.get([1, 1]);
  const tx = matrix.get([0, 2]);
  const ty = matrix.get([1, 2]);
  return `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`;
}
