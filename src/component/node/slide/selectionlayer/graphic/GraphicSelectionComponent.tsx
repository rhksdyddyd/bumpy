import React from 'react';
import useGraphicSelectionComponentEventListener from 'hook/component/node/slide/selectionlayer/graphic/useGraphicSelectionComponentEventListener';
import {
  GraphicSelectionComponentProps,
  ROTATION_HANDLE_EVENT_SIZE,
  ROTATION_HANDLE_LINE_LENGTH,
  ROTATION_HANDLE_SIZE,
  SELECTION_DEFAULT_MARGIN,
  SELECTION_GROUP_EXTRA_MARGIN,
  SELECTION_HANDLE_SIZE,
} from 'types/component/node/slide/selectionlayer/graphic/GraphicSelectionComponentTypes';
import useGraphicSelectionComponent from 'hook/component/node/slide/selectionlayer/graphic/useGraphicSelectionComponent';
import { GraphicTypeEnum } from 'types/model/node/graphic/GraphicTypeEnum';
import { IPoint } from 'types/common/geometry/GeometryTypes';

import styles from 'scss/component/node/slide/selectionlayer/graphic/GraphicSelection.module.scss';
import classNames from 'classnames';
import {
  CLASSNAME_GRAPHIC_CURSOR_MOVE_HOVER,
  CLASSNAME_GRAPHIC_CURSOR_ROTATE_HOVER,
} from 'types/common/cursor/CursorTypes';
import { GraphicEditingHandleProps } from 'types/store/container/edit/GraphicEditingHandleTypes';
import { getGraphicEditingHandleInfo } from 'util/node/slide/selectionlayer/graphic/GraphicSelectionComponentUtil';

const GraphicSelectionComponent = (props: GraphicSelectionComponentProps): React.JSX.Element => {
  const { graphicModel, isDirectlySelected } = props;
  const needMargin = graphicModel.getGraphicType() === GraphicTypeEnum.GROUP;
  const pathMargin = needMargin === true ? SELECTION_GROUP_EXTRA_MARGIN : 0;

  const {
    position,
    size,
    rotation,
    rotationTransform,
    flipTransform,
    editingHandleList,
    pathList,
  } = useGraphicSelectionComponent(graphicModel, pathMargin);

  const {
    handleMouseDownForMove,
    handleMouseDownForResize,
    handleMouseDownForRotation,
    handleMouseUp,
  } = useGraphicSelectionComponentEventListener(graphicModel);

  const strokeDasharray = isDirectlySelected === true ? '1,0' : '1,1';

  const selectionHandleSize = SELECTION_HANDLE_SIZE;
  const selectionHandleTransform = -selectionHandleSize / 2;

  const rotatationHandleSize = ROTATION_HANDLE_SIZE;
  const rotationHandleLineLength = ROTATION_HANDLE_LINE_LENGTH;
  const rotatationHandleEventSize = ROTATION_HANDLE_EVENT_SIZE;

  let margin = SELECTION_DEFAULT_MARGIN;
  const rotationHandlePosition: IPoint = {
    x: size.width / 2 - rotatationHandleSize / 2,
    y: -(rotationHandleLineLength + rotatationHandleSize),
  };
  const rotationEventRectPosition: IPoint = {
    x: size.width / 2 - rotatationHandleEventSize / 2,
    y: -(rotationHandleLineLength + rotatationHandleSize / 2 + rotatationHandleEventSize / 2),
  };
  const rotationHandleLinePosition: IPoint = {
    x: size.width / 2,
    y: -rotationHandleLineLength,
  };

  if (needMargin) {
    margin += SELECTION_GROUP_EXTRA_MARGIN + 1;
    rotationHandlePosition.x += SELECTION_GROUP_EXTRA_MARGIN / 2;
    rotationHandlePosition.y -= SELECTION_GROUP_EXTRA_MARGIN;
    rotationEventRectPosition.x += SELECTION_GROUP_EXTRA_MARGIN / 2;
    rotationEventRectPosition.y -= SELECTION_GROUP_EXTRA_MARGIN;
    rotationHandleLinePosition.x += SELECTION_GROUP_EXTRA_MARGIN / 2;
    rotationHandleLinePosition.y -= SELECTION_GROUP_EXTRA_MARGIN;
  }

  const selectionOutlinePath = pathList.at(0)?.d ?? '';

  const graphicSelectionCoordinateStyle: React.CSSProperties = {};
  graphicSelectionCoordinateStyle.left = `${position.x}px`;
  graphicSelectionCoordinateStyle.top = `${position.y}px`;

  return (
    <div
      className={classNames(styles.container)}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <svg // rotate handle
        className={classNames(styles.rotate_handle_svg)}
        style={{
          left: `${-margin}px`,
          top: `${-margin}px`,
          width: `${size.width + margin * 2}px`,
          height: `${size.height + margin * 2}px`,
          transform: `${rotationTransform} ${flipTransform}`,
        }}
      >
        <g
          className={classNames(styles.rotate_handle_event_g)}
          transform={`matrix(1,0,0,1,${margin},${margin})`}
          onMouseDown={handleMouseDownForRotation}
          onMouseUp={handleMouseUp}
        >
          <rect
            className={classNames(
              CLASSNAME_GRAPHIC_CURSOR_ROTATE_HOVER,
              styles.rotate_handle_event_rect
            )}
            width={`${rotatationHandleEventSize}px`}
            height={`${rotatationHandleEventSize}px`}
            transform={`matrix(1,0,0,1,${rotationEventRectPosition.x},${rotationEventRectPosition.y})`}
          />
        </g>
        <g
          className={classNames(styles.rotate_handle_g)}
          transform={`matrix(1,0,0,1,${margin},${margin})`}
        >
          <rect
            className={classNames(styles.rotate_handle_rect)}
            width={`${rotatationHandleSize}px`}
            height={`${rotatationHandleSize}px`}
            transform={`matrix(1,0,0,1,${rotationHandlePosition.x},${rotationHandlePosition.y})`}
          />
          <line
            className={classNames(styles.rotate_handle_line)}
            x1={`${rotationHandleLinePosition.x}`}
            y1={`${rotationHandleLinePosition.y}`}
            x2={`${rotationHandleLinePosition.x}`}
            y2={`${rotationHandleLinePosition.y + rotationHandleLineLength}`}
          />
        </g>
      </svg>
      <svg // resize handles
        className={classNames(styles.resize_handle_svg)}
        style={{
          left: `${-margin}px`,
          top: `${-margin}px`,
          width: `${size.width + margin * 2}px`,
          height: `${size.height + margin * 2}px`,
          transform: `${rotationTransform}`,
        }}
      >
        <g
          className={classNames(styles.resize_handle_outline_g)}
          transform={`matrix(1,0,0,1,${margin},${margin})`}
        >
          <path
            className={classNames(styles.resize_handle_outline)}
            d={selectionOutlinePath}
            strokeDasharray={strokeDasharray}
          />
          <path
            className={classNames(
              CLASSNAME_GRAPHIC_CURSOR_MOVE_HOVER,
              styles.resize_handle_outline_event
            )}
            d={selectionOutlinePath}
            onMouseDown={handleMouseDownForMove}
          />
          {editingHandleList.map(item => {
            const handleProps: GraphicEditingHandleProps = {
              handle: item,
              margin: pathMargin,
              objectWidth: size.width,
              objectHeight: size.height,
              objectRotation: rotation,
            };

            const handleInfo = getGraphicEditingHandleInfo(handleProps);
            const { left } = handleInfo.position;
            const { top } = handleInfo.position;
            const { cursor } = handleInfo;

            return (
              <g
                className={classNames(styles.resize_handle_g)}
                transform={`matrix(1,0,0,1,${left},${top})`}
                style={{ cursor }}
                onMouseDown={e => {
                  handleMouseDownForResize?.(e, item, cursor);
                }}
              >
                <rect
                  className={classNames(styles.resize_handle_rect)}
                  style={{
                    height: `${selectionHandleSize}px`,
                    width: `${selectionHandleSize}px`,
                  }}
                  transform={`matrix(1,0,0,1,${selectionHandleTransform},${selectionHandleTransform})`}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default GraphicSelectionComponent;
