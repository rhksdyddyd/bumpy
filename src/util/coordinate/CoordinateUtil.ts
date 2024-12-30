import * as math from 'mathjs';
import { ILine, IPoint, IRectWithCoord } from 'types/common/geometry/GeometryTypes';

export function isNearlyEqual(a: number, b: number): boolean {
  const eps = 0.00001;
  return Math.abs(a - b) < eps;
}

export function isTwoPointsNearlyEqual(point1: IPoint, point2: IPoint): boolean {
  return isNearlyEqual(point1.x, point2.x) && isNearlyEqual(point1.y, point2.y);
}

export function isTwoLineLengthNearlyEqual(line1: ILine, line2: ILine): boolean {
  return isNearlyEqual(
    getSquaredDistance(line1.from, line1.to),
    getSquaredDistance(line2.from, line2.to)
  );
}

export function isTwoVectorsInSameDirection(vec1: ILine, vec2: ILine): boolean {
  const positionVector1: IPoint = { x: vec1.from.x - vec1.to.x, y: vec1.from.y - vec1.to.y };
  const positionVector2: IPoint = { x: vec2.from.x - vec2.to.x, y: vec2.from.y - vec2.to.y };

  const angle = getAngleBetweenTwoPointsAndOrigin(positionVector1, positionVector2);

  return isNearlyEqual(angle, 0) || isNearlyEqual(angle, 360);
}

export function getDistance(from: IPoint, to: IPoint): number {
  return getSquaredDistance(from, to) ** 0.5;
}

export function getSquaredDistance(from: IPoint, to: IPoint): number {
  return (from.x - to.x) ** 2 + (from.y - to.y) ** 2;
}

export function degreeToRadian(degree: number): number {
  return radianMod2Pi((degree / 180) * math.pi);
}

export function radianToDegree(radian: number): number {
  return degreeMod360((radian / math.pi) * 180);
}

export function degreeMod360(degree: number): number {
  return math.mod(degree, 360);
}

export function radianMod2Pi(radian: number): number {
  return math.mod(radian, math.pi * 2);
}

export function getAngleBetweenThreePoints(
  angleStart: IPoint,
  angleEnd: IPoint,
  pivot: IPoint
): number {
  return getAngleBetweenTwoPointsAndOrigin(
    { x: angleStart.x - pivot.x, y: angleStart.y - pivot.y },
    { x: angleEnd.x - pivot.x, y: angleEnd.y - pivot.y }
  );
}

export function getAngleBetweenTwoPointsAndOrigin(angleStart: IPoint, angleEnd: IPoint): number {
  return radianToDegree(
    math.atan2(angleEnd.y, angleEnd.x) - math.atan2(angleStart.y, angleStart.x)
  );
}

export function getFlippedRotation(flipH: boolean, flipV: boolean, rotation: number): number {
  let resultRotaion = rotation;
  if (flipH !== flipV) {
    resultRotaion = degreeMod360(resultRotaion);

    if (resultRotaion >= 0 && resultRotaion < 90) {
      const delta = 90 - resultRotaion;
      resultRotaion += 2 * delta;
    } else if (resultRotaion >= 90 && resultRotaion <= 180) {
      const delta = resultRotaion - 90;
      resultRotaion -= 2 * delta;
    } else if (resultRotaion > 180 && resultRotaion <= 270) {
      const delta = 270 - resultRotaion;
      resultRotaion += 2 * delta;
    } else if (resultRotaion > 270 && resultRotaion <= 360) {
      const delta = resultRotaion - 270;
      resultRotaion -= 2 * delta;
    }
    resultRotaion += 180;
  }

  return degreeMod360(resultRotaion);
}

export function rotatePointAroundOrigin(point: IPoint, rotation360: number): IPoint {
  const radian = degreeToRadian(rotation360);
  return {
    x: math.cos(radian) * point.x - math.sin(radian) * point.y,
    y: math.sin(radian) * point.x + math.cos(radian) * point.y,
  };
}

export function rotatePointAroundPivot(point: IPoint, pivot: IPoint, rotation360: number): IPoint {
  const localizedPoint = { x: point.x - pivot.x, y: point.y - pivot.y };
  const rotatedPoint = rotatePointAroundOrigin(localizedPoint, rotation360);

  return { x: rotatedPoint.x + pivot.x, y: rotatedPoint.y + pivot.y };
}

export function flipPointAroundPivot(
  point: IPoint,
  pivot: IPoint,
  flipH: boolean,
  flipV: boolean
): IPoint {
  return { x: flipH ? 2 * pivot.x - point.x : point.x, y: flipV ? 2 * pivot.y - point.y : pivot.y };
}

export function isWHSwitched(rotation: number): boolean {
  const rotation360 = degreeMod360(rotation);
  return (rotation360 >= 45 && rotation360 < 135) || (rotation360 >= 225 && rotation360 < 315);
}

export function getRotatedBound(rect: IRectWithCoord, rotation360: number): IRectWithCoord {
  const { x, y, width, height } = rect;
  const pivot: IPoint = { x: x + width / 2, y: y + height / 2 };
  const leftTop: IPoint = { x, y };
  const leftBottom: IPoint = { x, y: y + height };
  const rotatedLeftTop = rotatePointAroundPivot(leftTop, pivot, rotation360);
  const rotatedLeftBottom = rotatePointAroundPivot(leftBottom, pivot, rotation360);
  const rotatedRightTop: IPoint = {
    x: pivot.x * 2 - rotatedLeftBottom.x,
    y: pivot.y * 2 - rotatedLeftBottom.y,
  };
  const rotatedRightBottom: IPoint = {
    x: pivot.x * 2 - rotatedLeftTop.x,
    y: pivot.y * 2 - rotatedLeftTop.y,
  };

  const boundX = math.min(
    rotatedLeftTop.x,
    rotatedRightTop.x,
    rotatedLeftBottom.x,
    rotatedRightBottom.x
  );
  const boundY = math.min(
    rotatedLeftTop.y,
    rotatedRightTop.y,
    rotatedLeftBottom.y,
    rotatedRightBottom.y
  );
  const boundWidth =
    math.max(rotatedLeftTop.x, rotatedRightTop.x, rotatedLeftBottom.x, rotatedRightBottom.x) -
    boundX;
  const boundHeight =
    math.max(rotatedLeftTop.y, rotatedRightTop.y, rotatedLeftBottom.y, rotatedRightBottom.y) -
    boundY;

  return { x: boundX, y: boundY, width: boundWidth, height: boundHeight };
}
