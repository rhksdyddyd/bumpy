import GraphicModel from 'model/node/graphic/GraphicModel';
import AppContext from 'store/context/AppContext';
import MouseEvent from 'store/manager/event/wrapper/MouseEvent';
import { IPoint } from 'types/common/geometry/GeometryTypes';
import { MouseEventCoordinateReferenceId } from 'types/component/node/slide/SlideComponentTypes';
import { applyGraphicModelTransformToRenderCoordinate } from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';

export function convertClientCoordinateToRenderCoordinate(
  clientCoordinate: IPoint,
  zoomRatio: number
): IPoint {
  const mouseEventCoordinateReference = document.getElementById(
    MouseEventCoordinateReferenceId
  ) as HTMLElement;

  const referenceCoordinateRect = mouseEventCoordinateReference?.getBoundingClientRect();

  return {
    x: (clientCoordinate.x - referenceCoordinateRect.left) / zoomRatio,
    y: (clientCoordinate.y - referenceCoordinateRect.top) / zoomRatio,
  };
}

export function calculateAppliableMouseDelta(
  event: MouseEvent,
  ctx: AppContext,
  eventTargetGraphicModel: GraphicModel,
  applyFlip: boolean
): IPoint {
  const editableContext = ctx.getEditableContext();
  const viewModeContainer = editableContext.getViewModeContainer();

  const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
  const zoomRatio = viewModeContainer.getZoomRatio();

  const editingStartedRenderCoordinate =
    graphicEditInfoContainer.getEditingStartedRenderCoordinate();

  const currentMouseRenderCoordinate = convertClientCoordinateToRenderCoordinate(
    {
      x: event.getClientX(),
      y: event.getClientY(),
    },
    zoomRatio
  );

  const editingStartedPositonBasedOnGraphicModel = applyGraphicModelTransformToRenderCoordinate(
    graphicEditInfoContainer,
    eventTargetGraphicModel,
    editingStartedRenderCoordinate,
    applyFlip
  );

  const currentMousePositonBasedOnGraphicModel = applyGraphicModelTransformToRenderCoordinate(
    graphicEditInfoContainer,
    eventTargetGraphicModel,
    currentMouseRenderCoordinate,
    applyFlip
  );

  return {
    x: currentMousePositonBasedOnGraphicModel.x - editingStartedPositonBasedOnGraphicModel.x,
    y: currentMousePositonBasedOnGraphicModel.y - editingStartedPositonBasedOnGraphicModel.y,
  };
}
