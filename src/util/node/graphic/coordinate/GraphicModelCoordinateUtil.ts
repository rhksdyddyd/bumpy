import * as math from 'mathjs';
import GraphicModel from 'model/node/graphic/GraphicModel';
import CoordinateInfo from 'model/node/graphic/info/CoordinateInfo';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import {
  degreeMod360,
  flipPointAroundPivot,
  isWHSwitched,
  rotatePointAroundPivot,
} from 'util/coordinate/CoordinateUtil';
import { IPoint, IResizeRatio, ISize } from 'types/common/geometry/GeometryTypes';
import { isGraphicModel } from 'util/node/TreeNodeTypeGuards';
import { GraphicEditingHandleEnum } from 'types/store/container/edit/GraphicEditingHandleEnum';
import {
  getAllParentGroupList,
  getRootGroup,
  isGroup,
  isGroupChild,
} from '../GraphicModelTreeNodeUtil';

// coordinate info
export function getCoordinateInfo(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): CoordinateInfo {
  if (
    graphicModel.getIsBeingEdited() === false &&
    getRootGroup(graphicModel)?.getIsBeingEdited() === false
  ) {
    return graphicModel.getCoordinateInfo();
  }

  return getCurrentEditingCoordinateInfo(graphicEditInfoContainer, graphicModel);
}

export function getInitialEditingCoordinateInfo(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): CoordinateInfo {
  const graphicModelEditRequest =
    graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(graphicModel);

  if (graphicModelEditRequest !== undefined) {
    return graphicModelEditRequest.getInitialCoordinateInfo();
  }
  return graphicModel.getCoordinateInfo();
}

export function getCurrentEditingCoordinateInfo(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): CoordinateInfo {
  const graphicModelEditRequest =
    graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(graphicModel);

  if (graphicModelEditRequest !== undefined) {
    return graphicModelEditRequest.getCurrentEditingCoordinateInfo();
  }
  return graphicModel.getCoordinateInfo();
}

function collectParentGroupNoneEditingCoordinateInfo(
  graphicModel: GraphicModel
): Array<CoordinateInfo> {
  let parentGroupList: GraphicModel[] = [];
  parentGroupList = getAllParentGroupList(graphicModel, false);
  return parentGroupList.map(parentGroup => {
    return parentGroup.getCoordinateInfo();
  });
}

function collectParentGroupInitialEditingCoordinateInfo(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): Array<CoordinateInfo> {
  const parentGroupList = getAllParentGroupList(graphicModel, false);

  return parentGroupList.map(parentGroup => {
    return getInitialEditingCoordinateInfo(graphicEditInfoContainer, parentGroup);
  });
}

function collectParentGroupCurrentEditingCoordinateInfo(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): Array<CoordinateInfo> {
  const parentGroupList = getAllParentGroupList(graphicModel, false);

  return parentGroupList.map(parentGroup => {
    return getCurrentEditingCoordinateInfo(graphicEditInfoContainer, parentGroup);
  });
}

// center coordinate
export function getDisplayedCenterCoordinate(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  isEditPreviewLayer: boolean
): IPoint {
  if (isEditPreviewLayer === true) {
    return getCurrentEditingDisplayedCenterCoordinate(graphicEditInfoContainer, graphicModel);
  }
  return getNoneEditingDisplayedCenterCoordinate(graphicModel);
}

export function getNoneEditingDisplayedCenterCoordinate(graphicModel: GraphicModel): IPoint {
  const targetGraphicModelCoordinateInfo = graphicModel.getCoordinateInfo();
  const parentGroupCoordinateInfoList = collectParentGroupNoneEditingCoordinateInfo(graphicModel);

  return getCenterCoordinateUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getInitialEditingDisplayedCenterCoordinate(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): IPoint {
  const targetGraphicModelCoordinateInfo = getInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getCenterCoordinateUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getCurrentEditingDisplayedCenterCoordinate(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): IPoint {
  const targetGraphicModelCoordinateInfo = getCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getCenterCoordinateUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

function getCenterCoordinateUsingCoordinateInfo(
  targetGraphicModelCoordinateInfo: CoordinateInfo,
  parentGroupCoordinateInfoList: Array<CoordinateInfo>
): IPoint {
  const x =
    targetGraphicModelCoordinateInfo.getX() + targetGraphicModelCoordinateInfo.getWidth() / 2;
  const y =
    targetGraphicModelCoordinateInfo.getY() + targetGraphicModelCoordinateInfo.getHeight() / 2;
  const p = math.matrix([[x], [y], [1]]);

  const groupMatrix = getAccumulatedTransformMatrix(parentGroupCoordinateInfoList);

  const pp = math.multiply(groupMatrix, p);

  return {
    x: Number(pp.get([0, 0])),
    y: Number(pp.get([1, 0])),
  };
}

// position
export function getDisplayedPosition(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  isEditPreviewLayer: boolean
): IPoint {
  if (isEditPreviewLayer === true) {
    return getCurrentEditingDisplayedPosition(graphicEditInfoContainer, graphicModel);
  }
  return getNoneEditingDisplayedPosition(graphicModel);
}

export function getNoneEditingDisplayedPosition(graphicModel: GraphicModel): IPoint {
  const centerCoordinate = getNoneEditingDisplayedCenterCoordinate(graphicModel);
  const size = getNoneEditingDisplayedSize(graphicModel);

  return {
    x: centerCoordinate.x - size.width / 2,
    y: centerCoordinate.y - size.height / 2,
  };
}

export function getInitialEditingDisplayedPosition(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): IPoint {
  const centerCoordinate = getInitialEditingDisplayedCenterCoordinate(
    graphicEditInfoContainer,
    graphicModel
  );
  const size = getInitialEditingDisplayedSize(graphicEditInfoContainer, graphicModel);

  return {
    x: centerCoordinate.x - size.width / 2,
    y: centerCoordinate.y - size.height / 2,
  };
}

export function getCurrentEditingDisplayedPosition(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): IPoint {
  const centerCoordinate = getCurrentEditingDisplayedCenterCoordinate(
    graphicEditInfoContainer,
    graphicModel
  );
  const size = getCurrentEditingDisplayedSize(graphicEditInfoContainer, graphicModel);

  return {
    x: centerCoordinate.x - size.width / 2,
    y: centerCoordinate.y - size.height / 2,
  };
}

// size
export function getDisplayedSize(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  isEditPreviewLayer: boolean
): ISize {
  if (isEditPreviewLayer === true) {
    return getCurrentEditingDisplayedSize(graphicEditInfoContainer, graphicModel);
  }
  return getNoneEditingDisplayedSize(graphicModel);
}

export function getNoneEditingDisplayedSize(graphicModel: GraphicModel): ISize {
  const targetGraphicModelCoordinateInfo = graphicModel.getCoordinateInfo();

  const resizeRatio = getNoneEditingDisplayedResizeRatio(graphicModel);
  const width = targetGraphicModelCoordinateInfo.getWidth() * resizeRatio.widthRatio;
  const height = targetGraphicModelCoordinateInfo.getHeight() * resizeRatio.heightRatio;

  return { width, height };
}

export function getInitialEditingDisplayedSize(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): ISize {
  const targetGraphicModelCoordinateInfo = getInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  const resizeRatio = getInitialEditingDisplayedResizeRatio(graphicEditInfoContainer, graphicModel);
  const width = targetGraphicModelCoordinateInfo.getWidth() * resizeRatio.widthRatio;
  const height = targetGraphicModelCoordinateInfo.getHeight() * resizeRatio.heightRatio;

  return { width, height };
}

export function getCurrentEditingDisplayedSize(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): ISize {
  const targetGraphicModelCoordinateInfo = getCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  const resizeRatio = getCurrentEditingDisplayedResizeRatio(graphicEditInfoContainer, graphicModel);
  const width = targetGraphicModelCoordinateInfo.getWidth() * resizeRatio.widthRatio;
  const height = targetGraphicModelCoordinateInfo.getHeight() * resizeRatio.heightRatio;

  return { width, height };
}

// localize render position
export function applyGraphicModelTransformToRenderCoordinate(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  renderCoordinate: IPoint,
  applyFlip: boolean
): IPoint {
  const centerCoordinate = getInitialEditingDisplayedCenterCoordinate(
    graphicEditInfoContainer,
    graphicModel
  );

  let transformAppliedCoordinate = rotatePointAroundPivot(
    renderCoordinate,
    centerCoordinate,
    -getInitialEditingDisplayedRotation(graphicEditInfoContainer, graphicModel)
  );

  if (applyFlip === true) {
    transformAppliedCoordinate = flipPointAroundPivot(
      transformAppliedCoordinate,
      centerCoordinate,
      getInitialEditingDisplayedFlipH(graphicEditInfoContainer, graphicModel),
      getInitialEditingDisplayedFlipV(graphicEditInfoContainer, graphicModel)
    );
  }

  return {
    x: transformAppliedCoordinate.x - centerCoordinate.x,
    y: transformAppliedCoordinate.y - centerCoordinate.y,
  };
}

export function getNoneEditingDisplayedResizeRatio(graphicModel: GraphicModel): IResizeRatio {
  const targetGraphicModelCoordinateInfo = graphicModel.getCoordinateInfo();
  const parentGroupCoordinateInfoList = collectParentGroupNoneEditingCoordinateInfo(graphicModel);

  return getResizeRatioUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getInitialEditingDisplayedResizeRatio(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): IResizeRatio {
  const targetGraphicModelCoordinateInfo = getInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getResizeRatioUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getCurrentEditingDisplayedResizeRatio(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): IResizeRatio {
  const targetGraphicModelCoordinateInfo = getCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getResizeRatioUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

function getResizeRatioUsingCoordinateInfo(
  targetGraphicModelCoordinateInfo: CoordinateInfo,
  parentGroupCoordinateInfoList: Array<CoordinateInfo>
): IResizeRatio {
  let widthRatio = 1;
  let heightRatio = 1;

  let rotation = targetGraphicModelCoordinateInfo.getRotation();

  parentGroupCoordinateInfoList.forEach(coordinateInfo => {
    const groupWidth = coordinateInfo.getGroupWidth();
    const groupHeight = coordinateInfo.getGroupHeight();

    let groupWidthRatio = groupWidth !== undefined ? coordinateInfo.getWidth() / groupWidth : 1;
    let groupHeightRatio = groupHeight !== undefined ? coordinateInfo.getHeight() / groupHeight : 1;

    if (isWHSwitched(rotation) === true) {
      const tmp = groupWidthRatio;
      groupWidthRatio = groupHeightRatio;
      groupHeightRatio = tmp;
    }

    rotation = applyParentCoordinateInfoToCurrentRotation(rotation, coordinateInfo);

    widthRatio *= groupWidthRatio;
    heightRatio *= groupHeightRatio;
  });

  return { widthRatio, heightRatio };
}

// rotation
export function getDisplayedRotation(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  isEditPreviewLayer: boolean
): number {
  if (isEditPreviewLayer === true) {
    return getCurrentEditingDisplayedRotation(graphicEditInfoContainer, graphicModel);
  }
  return getNoneEditingDisplayedRotation(graphicModel);
}

export function getNoneEditingDisplayedRotation(graphicModel: GraphicModel): number {
  const targetGraphicModelCoordinateInfo = graphicModel.getCoordinateInfo();
  const parentGroupCoordinateInfoList = collectParentGroupNoneEditingCoordinateInfo(graphicModel);

  return getRotationUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getInitialEditingDisplayedRotation(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): number {
  const targetGraphicModelCoordinateInfo = getInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getRotationUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getCurrentEditingDisplayedRotation(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): number {
  const targetGraphicModelCoordinateInfo = getCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getRotationUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

function getRotationUsingCoordinateInfo(
  targetGraphicModelCoordinateInfo: CoordinateInfo,
  parentGroupCoordinateInfoList: Array<CoordinateInfo>
): number {
  let rotation = targetGraphicModelCoordinateInfo.getRotation();

  parentGroupCoordinateInfoList.forEach(coordinateInfo => {
    rotation = applyParentCoordinateInfoToCurrentRotation(rotation, coordinateInfo);
  });

  return rotation;
}

function applyParentCoordinateInfoToCurrentRotation(
  currentRotation: number,
  parentCoordinateInfo: CoordinateInfo
): number {
  let rotation = currentRotation;

  if (parentCoordinateInfo.getFlipH() !== parentCoordinateInfo.getFlipV()) {
    rotation = 360 - rotation;
  }

  rotation += parentCoordinateInfo.getRotation();

  return rotation;
}

// flip
export function getDisplayedFlipH(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  isEditPreviewLayer: boolean
): boolean {
  if (isEditPreviewLayer === true) {
    return getCurrentEditingDisplayedFlipH(graphicEditInfoContainer, graphicModel);
  }
  return getNoneEditingDisplayedFlipH(graphicModel);
}

export function getNoneEditingDisplayedFlipH(graphicModel: GraphicModel): boolean {
  const targetGraphicModelCoordinateInfo = graphicModel.getCoordinateInfo();
  const parentGroupCoordinateInfoList = collectParentGroupNoneEditingCoordinateInfo(graphicModel);

  return getFlipHUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getInitialEditingDisplayedFlipH(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): boolean {
  const targetGraphicModelCoordinateInfo = getInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getFlipHUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getCurrentEditingDisplayedFlipH(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): boolean {
  const targetGraphicModelCoordinateInfo = getCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getFlipHUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getDisplayedFlipV(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  isEditPreviewLayer: boolean
): boolean {
  if (isEditPreviewLayer === true) {
    return getCurrentEditingDisplayedFlipV(graphicEditInfoContainer, graphicModel);
  }
  return getNoneEditingDisplayedFlipV(graphicModel);
}

export function getNoneEditingDisplayedFlipV(graphicModel: GraphicModel): boolean {
  const targetGraphicModelCoordinateInfo = graphicModel.getCoordinateInfo();
  const parentGroupCoordinateInfoList = collectParentGroupNoneEditingCoordinateInfo(graphicModel);

  return getFlipVUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getInitialEditingDisplayedFlipV(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): boolean {
  const targetGraphicModelCoordinateInfo = getInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getFlipVUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

export function getCurrentEditingDisplayedFlipV(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): boolean {
  const targetGraphicModelCoordinateInfo = getCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );
  const parentGroupCoordinateInfoList = collectParentGroupCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getFlipVUsingCoordinateInfo(
    targetGraphicModelCoordinateInfo,
    parentGroupCoordinateInfoList
  );
}

function getFlipHUsingCoordinateInfo(
  targetGraphicModelCoordinateInfo: CoordinateInfo,
  parentGroupCoordinateInfoList: Array<CoordinateInfo>
): boolean {
  let flipH = targetGraphicModelCoordinateInfo.getFlipH();

  parentGroupCoordinateInfoList.forEach(coordinateInfo => {
    flipH = flipH !== coordinateInfo.getFlipH();
  });

  return flipH;
}

function getFlipVUsingCoordinateInfo(
  targetGraphicModelCoordinateInfo: CoordinateInfo,
  parentGroupCoordinateInfoList: Array<CoordinateInfo>
): boolean {
  let flipV = targetGraphicModelCoordinateInfo.getFlipV();

  parentGroupCoordinateInfoList.forEach(coordinateInfo => {
    flipV = flipV !== coordinateInfo.getFlipV();
  });

  return flipV;
}

// matrix
export function getNoneEditingAccumulatedTransformMatrix(graphicModel: GraphicModel): math.Matrix {
  const coordinateInfoList = collectParentGroupNoneEditingCoordinateInfo(graphicModel);

  return getAccumulatedTransformMatrix(coordinateInfoList);
}

export function getInitialEditingAccumulatedTransformMatrix(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): math.Matrix {
  const coordinateInfoList = collectParentGroupInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getAccumulatedTransformMatrix(coordinateInfoList);
}

export function getCurrentEditingAccumulatedTransformMatrix(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): math.Matrix {
  const coordinateInfoList = collectParentGroupCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  return getAccumulatedTransformMatrix(coordinateInfoList);
}

export function getAccumulatedTransformMatrix(
  coordinateInfoList: Array<CoordinateInfo>
): math.Matrix {
  let accumulatedMatrix = math.identity(3, 3) as math.Matrix;

  const rotationList = new Array<number>();
  const widthRatioList = new Array<number>();
  const heightRatioList = new Array<number>();
  const flipHList = new Array<boolean>();
  const flipVList = new Array<boolean>();

  const coordinateInfoSize = coordinateInfoList.length;

  for (
    let coordinateInfoIndex = 0;
    coordinateInfoIndex < coordinateInfoSize;
    coordinateInfoIndex += 1
  ) {
    // root group to leaf
    const coordinateInfo = coordinateInfoList[coordinateInfoSize - 1 - coordinateInfoIndex];

    const currentRotation = coordinateInfo.getRotation();

    const currentWidth = coordinateInfo.getWidth();
    const currentHeight = coordinateInfo.getHeight();

    const groupWidth = coordinateInfo.getGroupWidth();
    const groupHeight = coordinateInfo.getGroupHeight();

    const currentWidthRatio = groupWidth ? currentWidth / groupWidth : 1;
    const currentHeightRatio = groupHeight ? currentHeight / groupHeight : 1;

    const currentFlipH = coordinateInfo.getFlipH();
    const currentFlipV = coordinateInfo.getFlipV();

    const currentCenterX = coordinateInfo.getX() + currentWidth / 2;
    const currentCenterY = coordinateInfo.getY() + currentHeight / 2;

    const accumulatedCenterPoint = math.multiply(
      accumulatedMatrix,
      math.matrix([[currentCenterX], [currentCenterY], [1]])
    );

    let accumulatedWidth = currentWidth;
    let accumulatedHeight = currentHeight;
    let accumulatedFlipH = currentFlipH;
    let accumulatedFlipV = currentFlipV;
    let accumulatedRotation = currentRotation;

    const listSize = rotationList.length;

    // leaf to root group
    for (let index = 0; index < listSize; index += 1) {
      const parentRotation = rotationList[listSize - 1 - index];
      const parentWidthRatio = widthRatioList[listSize - 1 - index];
      const parentHeightRatio = heightRatioList[listSize - 1 - index];
      const parentFlipH = flipHList[listSize - 1 - index];
      const parentFlipV = flipVList[listSize - 1 - index];

      if (isWHSwitched(accumulatedRotation) === true) {
        accumulatedWidth *= parentHeightRatio;
        accumulatedHeight *= parentWidthRatio;
      } else {
        accumulatedWidth *= parentWidthRatio;
        accumulatedHeight *= parentHeightRatio;
      }

      accumulatedFlipH = accumulatedFlipH !== parentFlipH;
      accumulatedFlipV = accumulatedFlipV !== parentFlipV;

      if (parentFlipH !== parentFlipV) {
        accumulatedRotation = 360 - accumulatedRotation;
      }

      accumulatedRotation += parentRotation;
    }

    const accumulatedX = Number(accumulatedCenterPoint.get([0, 0])) - accumulatedWidth / 2;
    const accumulatedY = Number(accumulatedCenterPoint.get([1, 0])) - accumulatedHeight / 2;

    accumulatedMatrix = getTransformMatrix(
      coordinateInfo,
      accumulatedX,
      accumulatedY,
      accumulatedWidth,
      accumulatedHeight,
      accumulatedFlipH,
      accumulatedFlipV,
      accumulatedRotation
    );

    rotationList.push(currentRotation);
    widthRatioList.push(currentWidthRatio);
    heightRatioList.push(currentHeightRatio);
    flipHList.push(currentFlipH);
    flipVList.push(currentFlipV);
  }

  return accumulatedMatrix;
}

// Ecma Office Open XML Part1
// L.4.7.6 Transformation Matrices 참고
export function getTransformMatrix(
  coordinateInfo: CoordinateInfo,
  x: number,
  y: number,
  width: number,
  height: number,
  flipH: boolean,
  flipV: boolean,
  rotation: number
): math.Matrix {
  return math.multiply(
    getGroupRFMatrix(x, y, width, height, flipH, flipV, rotation),
    getGroupSTMatrix(
      x,
      y,
      width,
      height,
      coordinateInfo.getGroupX() ?? 0,
      coordinateInfo.getGroupY() ?? 0,
      coordinateInfo.getGroupWidth() ?? 1,
      coordinateInfo.getGroupHeight() ?? 1
    )
  );
}

// matrix for rotation, flip
function getGroupRFMatrix(
  x: number,
  y: number,
  width: number,
  height: number,
  flipH: boolean,
  flipV: boolean,
  rotation: number
): math.Matrix {
  const scaleX = flipH === true ? -1 : 1;
  const scaleY = flipV === true ? -1 : 1;
  const cos = math.cos(math.unit(rotation, 'deg'));
  const sin = math.sin(math.unit(rotation, 'deg'));

  const u = math.matrix([
    [1, 0, -(x + width / 2)],
    [0, 1, -(y + height / 2)],
    [0, 0, 1],
  ]);
  const uInv = math.inv(u);
  const trf = math.multiply(
    math.multiply(
      math.multiply(
        uInv,
        math.matrix([
          [cos, -sin, 0],
          [sin, cos, 0],
          [0, 0, 1],
        ])
      ),
      math.matrix([
        [scaleX, 0, 0],
        [0, scaleY, 0],
        [0, 0, 1],
      ])
    ),
    u
  );

  return trf;
}

// matrix for scale, translate
function getGroupSTMatrix(
  x: number,
  y: number,
  width: number,
  height: number,
  groupX: number,
  groupY: number,
  groupWidth: number,
  groupHeight: number
): math.Matrix {
  const tst = math.matrix([
    [width / groupWidth, 0, x - (width / groupWidth) * groupX],
    [0, height / groupHeight, y - (height / groupHeight) * groupY],
    [0, 0, 1],
  ]);

  return tst;
}

// outer event
export function calculateResizeRatio(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  eventTargetGraphicModel: GraphicModel,
  appliableMouseDelta: IPoint,
  fixWHRatio: boolean
): IResizeRatio {
  const graphicEditingHandle = graphicEditInfoContainer.getGraphicEditingHandle();

  const initialSize = getInitialEditingDisplayedSize(
    graphicEditInfoContainer,
    eventTargetGraphicModel
  );

  switch (graphicEditingHandle) {
    case GraphicEditingHandleEnum.LEFT_TOP: {
      return applyResizeOptions(
        fixWHRatio,
        { width: initialSize.width, height: initialSize.height },
        {
          width: initialSize.width - appliableMouseDelta.x,
          height: initialSize.height - appliableMouseDelta.y,
        }
      );
    }
    case GraphicEditingHandleEnum.TOP: {
      return {
        widthRatio: 1,
        heightRatio: (initialSize.height - appliableMouseDelta.y) / initialSize.height,
      };
    }
    case GraphicEditingHandleEnum.RIGHT_TOP: {
      return applyResizeOptions(
        fixWHRatio,
        { width: initialSize.width, height: initialSize.height },
        {
          width: initialSize.width + appliableMouseDelta.x,
          height: initialSize.height - appliableMouseDelta.y,
        }
      );
    }
    case GraphicEditingHandleEnum.LEFT: {
      return {
        widthRatio: (initialSize.width - appliableMouseDelta.x) / initialSize.width,
        heightRatio: 1,
      };
    }
    case GraphicEditingHandleEnum.RIGHT: {
      return {
        widthRatio: initialSize.width
          ? (initialSize.width + appliableMouseDelta.x) / initialSize.width
          : 1,
        heightRatio: 1,
      };
    }
    case GraphicEditingHandleEnum.LEFT_BOTTOM: {
      return applyResizeOptions(
        fixWHRatio,
        { width: initialSize.width, height: initialSize.height },
        {
          width: initialSize.width - appliableMouseDelta.x,
          height: initialSize.height + appliableMouseDelta.y,
        }
      );
    }
    case GraphicEditingHandleEnum.BOTTOM: {
      return {
        widthRatio: 1,
        heightRatio: (initialSize.height + appliableMouseDelta.y) / initialSize.height,
      };
    }
    case GraphicEditingHandleEnum.RIGHT_BOTTOM: {
      return applyResizeOptions(
        fixWHRatio,
        { width: initialSize.width, height: initialSize.height },
        {
          width: initialSize.width + appliableMouseDelta.x,
          height: initialSize.height + appliableMouseDelta.y,
        }
      );
    }
    default: {
      break;
    }
  }
  return { widthRatio: 1, heightRatio: 1 };
}

function applyResizeOptions(
  fixWHRatio: boolean,
  initialSize: ISize,
  currentSize: ISize
): IResizeRatio {
  let widthRatio = 1;
  let heightRatio = 1;
  widthRatio = currentSize.width / initialSize.width;
  heightRatio = currentSize.height / initialSize.height;

  if (fixWHRatio === false) return { widthRatio, heightRatio };

  const largerRatio = math.max(math.abs(widthRatio), math.abs(heightRatio));
  widthRatio = math.sign(widthRatio) * largerRatio;
  heightRatio = math.sign(heightRatio) * largerRatio;
  return { widthRatio, heightRatio };
}

export function applyGraphicMoveDeltaToGraphicEditRequest(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  moveDelta: IPoint
): void {
  const graphicModelEditRequest =
    graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(graphicModel);
  if (graphicModelEditRequest !== undefined) {
    const initialCoordinateInfo = graphicModelEditRequest.getInitialCoordinateInfo();
    const currentEditingCoordinateInfo = graphicModelEditRequest.getCurrentEditingCoordinateInfo();

    const initialPosition = getInitialEditingDisplayedPosition(
      graphicEditInfoContainer,
      graphicModel
    );
    let newX = initialPosition.x + moveDelta.x;
    let newY = initialPosition.y + moveDelta.y;

    if (isGroupChild(graphicModel) === true) {
      const displayedSize = getInitialEditingDisplayedSize(graphicEditInfoContainer, graphicModel);
      const displayedCenterPoint = math.matrix([
        [newX + displayedSize.width / 2],
        [newY + displayedSize.height / 2],
        [1],
      ]);

      const accumulatedTransformationMatrix = getInitialEditingAccumulatedTransformMatrix(
        graphicEditInfoContainer,
        graphicModel
      );

      const newCenterPoint = math.multiply(
        math.inv(accumulatedTransformationMatrix),
        displayedCenterPoint
      );

      newX = Number(newCenterPoint.get([0, 0])) - initialCoordinateInfo.getWidth() / 2;
      newY = Number(newCenterPoint.get([1, 0])) - initialCoordinateInfo.getHeight() / 2;
    }

    currentEditingCoordinateInfo.setX(newX);
    currentEditingCoordinateInfo.setY(newY);
  }
}

export function applyResizeRatioToGraphicEditRequest(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  resizeRatio: IResizeRatio,
  useFlip: boolean,
  editingHandle?: GraphicEditingHandleEnum
): void {
  const graphicModelEditRequest =
    graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(graphicModel);

  if (graphicModelEditRequest === undefined) {
    return;
  }

  const graphicEditingHandle = editingHandle ?? graphicEditInfoContainer.getGraphicEditingHandle();

  const graphicModelCenterPointBeforeResize = getInitialEditingDisplayedCenterCoordinate(
    graphicEditInfoContainer,
    graphicModel
  );
  const graphicModelRotation = getInitialEditingDisplayedRotation(
    graphicEditInfoContainer,
    graphicModel
  );

  const initialSize = getInitialEditingDisplayedSize(graphicEditInfoContainer, graphicModel);
  const initialWidth = initialSize.width;
  const initialHeight = initialSize.height;

  const initialPosition = getInitialEditingDisplayedPosition(
    graphicEditInfoContainer,
    graphicModel
  );
  let newX = initialPosition.x;
  let newY = initialPosition.y;

  let newWidth = initialWidth * resizeRatio.widthRatio;
  let newHeight = initialHeight * resizeRatio.heightRatio;

  if (math.abs(newWidth) < 5) {
    newWidth = 5;
  }
  if (math.abs(newHeight) < 5) {
    newHeight = 5;
  }

  const newFlipH = resizeRatio.widthRatio < 0;
  const newFlipV = resizeRatio.heightRatio < 0;

  let graphicModelCenterPointAfterResize = { x: 0, y: 0 };

  switch (graphicEditingHandle) {
    case GraphicEditingHandleEnum.LEFT_TOP:
    case GraphicEditingHandleEnum.TOP:
    case GraphicEditingHandleEnum.LEFT: {
      // right bottom (fix)

      let rightBottomPoint = {
        x: graphicModelCenterPointBeforeResize.x + initialWidth / 2,
        y: graphicModelCenterPointBeforeResize.y + initialHeight / 2,
      };

      rightBottomPoint = rotatePointAroundPivot(
        rightBottomPoint,
        graphicModelCenterPointBeforeResize,
        graphicModelRotation
      );

      let leftTopPointAfterResize = {
        x: graphicModelCenterPointBeforeResize.x + initialWidth / 2 - newWidth,
        y: graphicModelCenterPointBeforeResize.y + initialHeight / 2 - newHeight,
      };

      leftTopPointAfterResize = rotatePointAroundPivot(
        leftTopPointAfterResize,
        graphicModelCenterPointBeforeResize,
        graphicModelRotation
      );

      graphicModelCenterPointAfterResize = {
        x: (leftTopPointAfterResize.x + rightBottomPoint.x) / 2,
        y: (leftTopPointAfterResize.y + rightBottomPoint.y) / 2,
      };

      const leftTopPointWithoutRotation = rotatePointAroundPivot(
        leftTopPointAfterResize,
        graphicModelCenterPointAfterResize,
        -graphicModelRotation
      );

      const rightBottomPointWithoutRotation = rotatePointAroundPivot(
        rightBottomPoint,
        graphicModelCenterPointAfterResize,
        -graphicModelRotation
      );

      newX = math.min(leftTopPointWithoutRotation.x, rightBottomPointWithoutRotation.x);
      newY = math.min(leftTopPointWithoutRotation.y, rightBottomPointWithoutRotation.y);
      break;
    }
    case GraphicEditingHandleEnum.RIGHT:
    case GraphicEditingHandleEnum.BOTTOM:
    case GraphicEditingHandleEnum.RIGHT_BOTTOM: {
      // left top (fix)

      let leftTopPoint = {
        x: graphicModelCenterPointBeforeResize.x - initialWidth / 2,
        y: graphicModelCenterPointBeforeResize.y - initialHeight / 2,
      };

      leftTopPoint = rotatePointAroundPivot(
        leftTopPoint,
        graphicModelCenterPointBeforeResize,
        graphicModelRotation
      );

      let rightBottomPointAfterResize = {
        x: graphicModelCenterPointBeforeResize.x - initialWidth / 2 + newWidth,
        y: graphicModelCenterPointBeforeResize.y - initialHeight / 2 + newHeight,
      };

      rightBottomPointAfterResize = rotatePointAroundPivot(
        rightBottomPointAfterResize,
        graphicModelCenterPointBeforeResize,
        graphicModelRotation
      );

      graphicModelCenterPointAfterResize = {
        x: (leftTopPoint.x + rightBottomPointAfterResize.x) / 2,
        y: (leftTopPoint.y + rightBottomPointAfterResize.y) / 2,
      };

      const leftTopPointWithoutRotation = rotatePointAroundPivot(
        leftTopPoint,
        graphicModelCenterPointAfterResize,
        -graphicModelRotation
      );

      const rightBottomPointWithoutRotation = rotatePointAroundPivot(
        rightBottomPointAfterResize,
        graphicModelCenterPointAfterResize,
        -graphicModelRotation
      );

      newX = math.min(leftTopPointWithoutRotation.x, rightBottomPointWithoutRotation.x);
      newY = math.min(leftTopPointWithoutRotation.y, rightBottomPointWithoutRotation.y);
      break;
    }
    case GraphicEditingHandleEnum.RIGHT_TOP: {
      // left bottom (fix)
      let leftBottomPoint = {
        x: graphicModelCenterPointBeforeResize.x - initialWidth / 2,
        y: graphicModelCenterPointBeforeResize.y + initialHeight / 2,
      };

      leftBottomPoint = rotatePointAroundPivot(
        leftBottomPoint,
        graphicModelCenterPointBeforeResize,
        graphicModelRotation
      );

      let rightTopPointAfterResize = {
        x: graphicModelCenterPointBeforeResize.x - initialWidth / 2 + newWidth,
        y: graphicModelCenterPointBeforeResize.y + initialHeight / 2 - newHeight,
      };

      rightTopPointAfterResize = rotatePointAroundPivot(
        rightTopPointAfterResize,
        graphicModelCenterPointBeforeResize,
        graphicModelRotation
      );

      graphicModelCenterPointAfterResize = {
        x: (rightTopPointAfterResize.x + leftBottomPoint.x) / 2,
        y: (rightTopPointAfterResize.y + leftBottomPoint.y) / 2,
      };

      const rightTopPointWithoutRotation = rotatePointAroundPivot(
        rightTopPointAfterResize,
        graphicModelCenterPointAfterResize,
        -graphicModelRotation
      );

      const leftBottomPointWithoutRotation = rotatePointAroundPivot(
        leftBottomPoint,
        graphicModelCenterPointAfterResize,
        -graphicModelRotation
      );

      newX = math.min(rightTopPointWithoutRotation.x, leftBottomPointWithoutRotation.x);
      newY = math.min(rightTopPointWithoutRotation.y, leftBottomPointWithoutRotation.y);
      break;
    }
    case GraphicEditingHandleEnum.LEFT_BOTTOM: {
      // right top (fix)
      let rightTopPoint = {
        x: graphicModelCenterPointBeforeResize.x + initialWidth / 2,
        y: graphicModelCenterPointBeforeResize.y - initialHeight / 2,
      };

      rightTopPoint = rotatePointAroundPivot(
        rightTopPoint,
        graphicModelCenterPointBeforeResize,
        graphicModelRotation
      );

      let leftBottomPointAfterResize = {
        x: graphicModelCenterPointBeforeResize.x + initialWidth / 2 - newWidth,
        y: graphicModelCenterPointBeforeResize.y - initialHeight / 2 + newHeight,
      };

      leftBottomPointAfterResize = rotatePointAroundPivot(
        leftBottomPointAfterResize,
        graphicModelCenterPointBeforeResize,
        graphicModelRotation
      );

      graphicModelCenterPointAfterResize = {
        x: (rightTopPoint.x + leftBottomPointAfterResize.x) / 2,
        y: (rightTopPoint.y + leftBottomPointAfterResize.y) / 2,
      };

      const rightTopPointWithoutRotation = rotatePointAroundPivot(
        rightTopPoint,
        graphicModelCenterPointAfterResize,
        -graphicModelRotation
      );

      const leftBottomPointWithoutRotation = rotatePointAroundPivot(
        leftBottomPointAfterResize,
        graphicModelCenterPointAfterResize,
        -graphicModelRotation
      );

      newX = math.min(rightTopPointWithoutRotation.x, leftBottomPointWithoutRotation.x);
      newY = math.min(rightTopPointWithoutRotation.y, leftBottomPointWithoutRotation.y);
      break;
    }
    default: {
      break;
    }
  }

  newWidth = math.abs(newWidth);
  newHeight = math.abs(newHeight);

  applyCoordinateToGraphicEditRequest(
    graphicEditInfoContainer,
    graphicModel,
    {
      x: newX,
      y: newY,
      centerX: graphicModelCenterPointAfterResize.x,
      centerY: graphicModelCenterPointAfterResize.y,
      width: newWidth,
      height: newHeight,
      flipH: newFlipH,
      flipV: newFlipV,
    },
    useFlip
  );
}

export function applyCoordinateToGraphicEditRequest(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  newCoordinate: {
    x: number;
    y: number;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    flipH: boolean;
    flipV: boolean;
  },
  useFlip: boolean
): void {
  const graphicModelEditRequest =
    graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(graphicModel);

  if (graphicModelEditRequest === undefined) {
    return;
  }

  let newX = newCoordinate.x;
  let newY = newCoordinate.y;

  let newWidth = newCoordinate.width;
  let newHeight = newCoordinate.height;

  if (isGroupChild(graphicModel) === true) {
    const displayedResizeRatio = getInitialEditingDisplayedResizeRatio(
      graphicEditInfoContainer,
      graphicModel
    );
    newWidth /= displayedResizeRatio.widthRatio;
    newHeight /= displayedResizeRatio.heightRatio;

    const accumulatedTransformationMatrix = getInitialEditingAccumulatedTransformMatrix(
      graphicEditInfoContainer,
      graphicModel
    );
    const displayedCenterPoint = math.matrix([
      [newCoordinate.centerX],
      [newCoordinate.centerY],
      [1],
    ]);
    const newCenterPoint = math.multiply(
      math.inv(accumulatedTransformationMatrix),
      displayedCenterPoint
    );

    newX = Number(newCenterPoint.get([0, 0])) - newWidth / 2;
    newY = Number(newCenterPoint.get([1, 0])) - newHeight / 2;
  }

  const initialCoordinateInfo = graphicModelEditRequest.getInitialCoordinateInfo();
  const currentEditingCoordinateInfo = graphicModelEditRequest.getCurrentEditingCoordinateInfo();

  currentEditingCoordinateInfo.setX(newX);
  currentEditingCoordinateInfo.setY(newY);
  currentEditingCoordinateInfo.setWidth(newWidth);
  currentEditingCoordinateInfo.setHeight(newHeight);

  if (useFlip) {
    currentEditingCoordinateInfo.setFlipH(initialCoordinateInfo.getFlipH() !== newCoordinate.flipH);
    currentEditingCoordinateInfo.setFlipV(initialCoordinateInfo.getFlipV() !== newCoordinate.flipV);
  }
}

export function applyRotationToGraphicEditRequest(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel,
  rotatedAngle: number,
  isShiftDown: boolean
): void {
  const graphicModelEditRequest =
    graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(graphicModel);

  if (graphicModelEditRequest !== undefined) {
    const initialCoordinateInfo = graphicModelEditRequest.getInitialCoordinateInfo();
    const currentEditingCoordinateInfo = graphicModelEditRequest.getCurrentEditingCoordinateInfo();

    let newAngle = degreeMod360(initialCoordinateInfo.getRotation() + rotatedAngle);

    if (isShiftDown === true) {
      newAngle = Math.floor(newAngle / 15) * 15;
    }

    currentEditingCoordinateInfo.setRotation(newAngle);

    const initialResizeRatio = getInitialEditingDisplayedResizeRatio(
      graphicEditInfoContainer,
      graphicModel
    );
    const currentEditinginitialResizeRatio = getCurrentEditingDisplayedResizeRatio(
      graphicEditInfoContainer,
      graphicModel
    );

    currentEditingCoordinateInfo.setWidth(
      (initialCoordinateInfo.getWidth() * initialResizeRatio.widthRatio) /
        currentEditinginitialResizeRatio.widthRatio
    );
    currentEditingCoordinateInfo.setHeight(
      (initialCoordinateInfo.getHeight() * initialResizeRatio.heightRatio) /
        currentEditinginitialResizeRatio.heightRatio
    );

    currentEditingCoordinateInfo.setX(
      initialCoordinateInfo.getX() +
        initialCoordinateInfo.getWidth() / 2 -
        currentEditingCoordinateInfo.getWidth() / 2
    );
    currentEditingCoordinateInfo.setY(
      initialCoordinateInfo.getY() +
        initialCoordinateInfo.getHeight() / 2 -
        currentEditingCoordinateInfo.getHeight() / 2
    );
  }
}

export function updateEditingDependentTreeMember(
  graphicEditInfoContainer: GraphicEditInfoContainer
): void {
  updateEditingDependentParentGroup(graphicEditInfoContainer);
  updateEditingDependentChildNode(graphicEditInfoContainer);
}

function updateEditingDependentParentGroup(
  graphicEditInfoContainer: GraphicEditInfoContainer
): void {
  const editRequestMap = graphicEditInfoContainer.getEditingDependentGraphicModelEditRequestMap();
  const parentGroupMap = new Map<GraphicModel, number>();

  editRequestMap.forEach((editRequest, graphicModel) => {
    let d = 0;
    let parent = graphicModel.getParent();
    while (isGraphicModel(parent) && isGroup(parent)) {
      d += 1;
      const depth = parentGroupMap.get(parent);
      if (depth === undefined || depth < d) {
        parentGroupMap.set(parent, d);
      }

      parent = parent.getParent();
    }
  });

  const distanceArray: [GraphicModel, number][] = Array.from(parentGroupMap);
  // 최상위 그룹에 대한 거리로 내림차순 정렬
  distanceArray.sort((a, b) => b[1] - a[1]);

  distanceArray.forEach(tuple => {
    updateEditingDependentParentGroupEditRequest(graphicEditInfoContainer, tuple[0]);
  });
}

function updateEditingDependentChildNode(graphicEditInfoContainer: GraphicEditInfoContainer): void {
  // do something
}

function updateEditingDependentParentGroupEditRequest(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  parentGroup: GraphicModel
): void {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  parentGroup.mapChild(child => {
    const childGraphicModel = child as GraphicModel;
    const childGraphicModelEditRequest =
      graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(childGraphicModel);
    const childCoordInfo =
      childGraphicModelEditRequest?.getCurrentEditingCoordinateInfo() ??
      childGraphicModel.getCoordinateInfo();

    if (childCoordInfo !== undefined) {
      let childMinX: number;
      let childMinY: number;
      let childMaxX: number;
      let childMaxY: number;

      if (isWHSwitched(childCoordInfo.getRotation()) === true) {
        const centerX = childCoordInfo.getX() + childCoordInfo.getWidth() / 2;
        const centerY = childCoordInfo.getY() + childCoordInfo.getHeight() / 2;

        childMinX = centerX - childCoordInfo.getHeight() / 2;
        childMinY = centerY - childCoordInfo.getWidth() / 2;
        childMaxX = centerX + childCoordInfo.getHeight() / 2;
        childMaxY = centerY + childCoordInfo.getWidth() / 2;
      } else {
        childMinX = childCoordInfo.getX();
        childMinY = childCoordInfo.getY();
        childMaxX = childCoordInfo.getX() + childCoordInfo.getWidth();
        childMaxY = childCoordInfo.getY() + childCoordInfo.getHeight();
      }

      minX = math.min(minX, childMinX);
      minY = math.min(minY, childMinY);
      maxX = math.max(maxX, childMaxX);
      maxY = math.max(maxY, childMaxY);
    }
  });

  // group 업데이트 request 생성
  graphicEditInfoContainer.appendEditingDependentGraphicModelEditRequest(parentGroup);

  const parentEditRequest =
    graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(parentGroup);

  if (parentEditRequest !== undefined) {
    const parentCurrentCoordInfo = parentEditRequest.getCurrentEditingCoordinateInfo();
    const parentInitCoordInfo = parentEditRequest.getInitialCoordinateInfo();

    parentCurrentCoordInfo.setGroupX(minX);
    parentCurrentCoordInfo.setGroupY(minY);
    parentCurrentCoordInfo.setGroupWidth(maxX - minX);
    parentCurrentCoordInfo.setGroupHeight(maxY - minY);

    parentCurrentCoordInfo.setWidth(
      ((parentCurrentCoordInfo.getGroupWidth() ?? 1) * parentInitCoordInfo.getWidth()) /
        (parentInitCoordInfo.getGroupWidth() ?? 1)
    );
    parentCurrentCoordInfo.setHeight(
      ((parentCurrentCoordInfo.getGroupHeight() ?? 1) * parentInitCoordInfo.getHeight()) /
        (parentInitCoordInfo.getGroupHeight() ?? 1)
    );

    const newGroupPosition = calculateNewGroupPosition(graphicEditInfoContainer, parentGroup);

    parentCurrentCoordInfo.setX(newGroupPosition.x);
    parentCurrentCoordInfo.setY(newGroupPosition.y);
  }
}

function calculateNewGroupPosition(
  graphicEditInfoContainer: GraphicEditInfoContainer,
  graphicModel: GraphicModel
): IPoint {
  const initialEditingCoordinateInfoList = collectParentGroupInitialEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  const initialEditingAccumulatedTotalMatrix = getAccumulatedTransformMatrix([
    getInitialEditingCoordinateInfo(graphicEditInfoContainer, graphicModel),
    ...initialEditingCoordinateInfoList,
  ]);

  const currentEditingCoordinateInfoList = collectParentGroupCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  const currentEditingCoordinateInfo = getCurrentEditingCoordinateInfo(
    graphicEditInfoContainer,
    graphicModel
  );

  const currentEditingAccumulatedParentMatrix = getAccumulatedTransformMatrix(
    currentEditingCoordinateInfoList
  );
  const currentEditingAccumulatedTotalMatrix = getAccumulatedTransformMatrix([
    currentEditingCoordinateInfo,
    ...currentEditingCoordinateInfoList,
  ]);

  const currentEditingDisplayedPosition = getCurrentEditingDisplayedPosition(
    graphicEditInfoContainer,
    graphicModel
  );
  const currenEditingDisplayedtSize = getCurrentEditingDisplayedSize(
    graphicEditInfoContainer,
    graphicModel
  );

  const inverseOfCurrentEditingTranslateMatrix = math.inv(
    math.matrix([
      [1, 0, currentEditingDisplayedPosition.x],
      [0, 1, currentEditingDisplayedPosition.y],
      [0, 0, 1],
    ])
  );

  // rfts 행렬을 풀면
  // t X 나머지 행렬 꼴임
  const currentEditingAccumulatedTotalMatrixWithoutTranslation = math.multiply(
    inverseOfCurrentEditingTranslateMatrix,
    currentEditingAccumulatedTotalMatrix
  );

  const newAccumulatedTranslationMatrix = math.multiply(
    initialEditingAccumulatedTotalMatrix,
    math.inv(currentEditingAccumulatedTotalMatrixWithoutTranslation)
  );

  const newAccumulatedCenterMatrix = math.matrix([
    [
      1,
      0,
      Number(newAccumulatedTranslationMatrix.get([0, 2])) + currenEditingDisplayedtSize.width / 2,
    ],
    [
      0,
      1,
      Number(newAccumulatedTranslationMatrix.get([1, 2])) + currenEditingDisplayedtSize.height / 2,
    ],
    [0, 0, 1],
  ]);

  const newCenterMatrix = math.multiply(
    math.inv(currentEditingAccumulatedParentMatrix),
    newAccumulatedCenterMatrix
  );

  return {
    x: Number(newCenterMatrix.get([0, 2]) - currentEditingCoordinateInfo.getWidth() / 2),
    y: Number(newCenterMatrix.get([1, 2]) - currentEditingCoordinateInfo.getHeight() / 2),
  };
}
