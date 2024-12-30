import React from 'react';
import { IPath } from 'types/model/node/graphic/GraphicTypes';
import { FillTypeEnum } from 'types/model/node/graphic/FillTypeEnum';
import { ISize } from 'types/common/geometry/GeometryTypes';
import { GraphicMouseHandlerType } from 'types/hook/graphic/GraphicEventHookTypes';

export function makeFillGetterFunction(
  fillType: Nullable<FillTypeEnum>,
  defaultFill: string
): (fill: string) => string {
  const getFillFunction = (fill: string) => {
    let fillColor = 'none';
    if (fill !== 'none') {
      fillColor = defaultFill;
    }
    return fillColor;
  };

  return getFillFunction;
}

export function makeStrokeFillGetterFunction(
  strokeFillType: Nullable<FillTypeEnum>,
  defaultStrokeFill: string
): (fill: string) => string {
  const getStrokeFunction = (stroke: string) => {
    let strokeColor = 'none';
    if (stroke === 'default') {
      strokeColor = defaultStrokeFill;
    }
    return strokeColor;
  };

  return getStrokeFunction;
}

export function getEventSVG(
  size: ISize,
  pathList: IPath[],
  strokeWidth: number,
  extraEventWidth: number,
  pointerEvents: string,
  cursor: string,
  handleMouseDown: GraphicMouseHandlerType
): React.JSX.Element {
  const eventPathStrokeWidth = (strokeWidth < 1 ? 1 : strokeWidth) + extraEventWidth;

  return (
    <svg
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        overflow: 'visible',
        top: 0,
        left: 0,
        width: `${size.width}`,
        height: `${size.height}`,
      }}
    >
      <g>
        {pathList.map((path, index) => {
          return (
            <path
              // eslint-disable-next-line react/no-array-index-key
              key={`event_path_${index}`}
              visibility="hidden"
              pointerEvents={pointerEvents}
              style={{
                stroke: `transparent`,
                cursor,
              }}
              d={path.d}
              strokeWidth={eventPathStrokeWidth}
              onMouseDown={handleMouseDown}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function getRenderSVG(
  size: ISize,
  pathList: IPath[],
  strokeWidth: Nullable<number>,
  getFillFunction: (fill: string) => string,
  getStrokeFillFunction: (fill: string) => string,
  isEditPreviewLayer: boolean
): React.JSX.Element {
  const getFill = (path: IPath) => {
    const resultFill = getFillFunction(path.fill);
    if (resultFill === '') {
      return 'transparent';
    }
    return resultFill;
  };

  const gList = pathList.map((path, index) => (
    <path
      key={`clippath_path_${index.toString()}`}
      style={{
        fill: getFill(path),
        stroke: getStrokeFillFunction(path.stroke),
        strokeWidth: `${strokeWidth}`,
        strokeDasharray: '',
      }}
      d={path.d}
    />
  ));

  return (
    <svg
      style={{
        pointerEvents: 'none',
        top: 0,
        left: 0,
        width: size.width > 1 ? size.width : 1,
        height: size.height > 1 ? size.height : 1,
        overflow: 'visible',
        position: 'absolute',
        opacity: isEditPreviewLayer ? 0.6 : undefined,
      }}
    >
      <g>{gList}</g>
    </svg>
  );
}
