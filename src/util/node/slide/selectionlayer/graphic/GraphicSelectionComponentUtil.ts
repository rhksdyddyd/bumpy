import { GraphicEditingHandleEnum } from 'types/store/container/edit/GraphicEditingHandleEnum';
import {
  GraphicEditingHandleInfo,
  GraphicEditingHandleProps,
} from 'types/store/container/edit/GraphicEditingHandleTypes';
import { degreeMod360 } from 'util/coordinate/CoordinateUtil';

export function getGraphicEditingHandleInfo(
  props: GraphicEditingHandleProps
): GraphicEditingHandleInfo {
  const { margin } = props;
  const { handle } = props;
  const width = props.objectWidth;
  const height = props.objectHeight;
  const rotation = props.objectRotation;

  let top = margin ? -margin + 1 : 0;
  let left = margin ? -margin + 1 : 0;

  let resizeAngle = 0;

  if (handle === GraphicEditingHandleEnum.LEFT_TOP) {
    resizeAngle = 315;
  } else if (handle === GraphicEditingHandleEnum.TOP) {
    resizeAngle = 0;
    left = (width + margin) / 2;
  } else if (handle === GraphicEditingHandleEnum.RIGHT_TOP) {
    resizeAngle = 45;
    left = width + margin;
  } else if (handle === GraphicEditingHandleEnum.LEFT) {
    resizeAngle = 270;
    top = (height + margin) / 2;
  } else if (handle === GraphicEditingHandleEnum.RIGHT) {
    resizeAngle = 90;
    left = width + margin;
    top = (height + margin) / 2;
  } else if (handle === GraphicEditingHandleEnum.LEFT_BOTTOM) {
    resizeAngle = 225;
    top = height + margin;
  } else if (handle === GraphicEditingHandleEnum.BOTTOM) {
    resizeAngle = 180;
    top = height + margin;
    left = (width + margin) / 2;
  } else if (handle === GraphicEditingHandleEnum.RIGHT_BOTTOM) {
    resizeAngle = 135;
    top = height + margin;
    left = width + margin;
  }

  resizeAngle += rotation;
  resizeAngle = degreeMod360(resizeAngle);

  const cursor = getCursorType(resizeAngle);

  const handleInfo: GraphicEditingHandleInfo = {
    cursor,
    position: { left, top },
  };
  return handleInfo;
}

function getCursorType(resizeAngle: number): string {
  let cursor = '';

  // ns ㅣ
  // nesw /
  // ew ㅡ
  // nwse \

  if (resizeAngle >= 22.5 && resizeAngle < 67.5) {
    cursor = 'nesw';
  } else if (resizeAngle >= 67.5 && resizeAngle < 112.5) {
    cursor = 'ew';
  } else if (resizeAngle >= 112.5 && resizeAngle < 157.5) {
    cursor = 'nwse';
  } else if (resizeAngle >= 157.5 && resizeAngle < 202.5) {
    cursor = 'ns';
  } else if (resizeAngle >= 202.5 && resizeAngle < 247.5) {
    cursor = 'nesw';
  } else if (resizeAngle >= 247.5 && resizeAngle < 292.5) {
    cursor = 'ew';
  } else if (resizeAngle >= 292.5 && resizeAngle < 337.5) {
    cursor = 'nwse';
  } else {
    // in case of resizeAngle >= 337.5 || resizeAngle < 22.5
    cursor = 'ns';
  }

  const result = `${cursor}-resize`;
  return result;
}
