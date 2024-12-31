import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import { convertClientCoordinateToRenderCoordinate } from 'util/coordinate/RenderCoordinateUtil';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import { ISize } from 'types/common/geometry/GeometryTypes';
import { CommandEnum } from 'types/store/command/CommandEnum';
import EventHandler from '../EventHandler';
import MouseEvent from '../../wrapper/MouseEvent';
import KeyEvent from '../../wrapper/KeyEvent';

class GraphicInsertEventHandler extends EventHandler {
  @boundMethod
  public override onMouseDown(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();
    event.preventDefault();

    const editableContext = ctx.getEditableContext();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    const viewModeContainer = editableContext.getViewModeContainer();

    const eventState = editableContext.getEventState();
    const eventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const zoomRatio = viewModeContainer.getZoomRatio();

    if (this.isMouseDownValid(eventState, graphicEditInfoContainer) === false) {
      if (eventSubState !== GraphicEditEventSubStateEnum.ABORT) {
        graphicEditInfoContainer.abortCurrentEditingState();
      }
      return true;
    }

    graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.PRESSED);

    const editingStartedRenderCoordinate = convertClientCoordinateToRenderCoordinate(
      { x: event.getClientX(), y: event.getClientY() },
      zoomRatio
    );

    graphicEditInfoContainer.setEditingStartedRenderCoordinate(editingStartedRenderCoordinate);

    return true;
  }

  @boundMethod
  public override onDrag(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();

    const editableContext = ctx.getEditableContext();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    const viewModeContainer = editableContext.getViewModeContainer();
    const proxryLayerInfoContainer = editableContext.getProxyLayerInfoContainer();

    const eventState = editableContext.getEventState();
    const eventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const zoomRatio = viewModeContainer.getZoomRatio();

    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (eventSubState === GraphicEditEventSubStateEnum.PRESSED) {
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.DRAG);
      graphicEditInfoContainer.setIsBeingEditedToAllEditingDependentGraphicModels(true);
      proxryLayerInfoContainer.disableEditViewProxyLayer();
      proxryLayerInfoContainer.enableAppAreaProxyLayer(
        eventTargetGraphicModel,
        {
          cursorType: 'crosshair',
        },
        true,
        false
      );
      graphicEditInfoContainer.requestRerenderSelectionLayer(ctx);
    }

    if (
      this.isMouseMoveValid(eventState, graphicEditInfoContainer) === false ||
      eventTargetGraphicModel === undefined
    ) {
      if (eventSubState !== GraphicEditEventSubStateEnum.ABORT) {
        graphicEditInfoContainer.abortCurrentEditingState();
      }
      return true;
    }

    const editingStartedRenderCoordinate =
      graphicEditInfoContainer.getEditingStartedRenderCoordinate();

    const currentMouseRenderCoordinate = convertClientCoordinateToRenderCoordinate(
      { x: event.getClientX(), y: event.getClientY() },
      zoomRatio
    );

    const mouseDelta = {
      x: currentMouseRenderCoordinate.x - editingStartedRenderCoordinate.x,
      y: currentMouseRenderCoordinate.y - editingStartedRenderCoordinate.y,
    };

    const size: ISize = { width: mouseDelta.x, height: mouseDelta.y };

    if (event.isShiftDown()) {
      const largerAbsoluteValue = Math.max(Math.abs(mouseDelta.x), Math.abs(mouseDelta.y), 5);
      size.width = Math.sign(mouseDelta.x) * largerAbsoluteValue;
      size.height = Math.sign(mouseDelta.y) * largerAbsoluteValue;
    } else {
      if (mouseDelta.x >= 0 && mouseDelta.x <= 5) size.width = 5;
      else if (mouseDelta.x >= -5 && mouseDelta.x < 0) size.width = -5;
      if (mouseDelta.y >= 0 && mouseDelta.y <= 5) size.height = 5;
      else if (mouseDelta.y >= -5 && mouseDelta.y < 0) size.height = -5;
    }

    const eventTargetCoordinateInfo = eventTargetGraphicModel.getCoordinateInfo();

    if (mouseDelta.x >= 0) {
      eventTargetCoordinateInfo.setX(editingStartedRenderCoordinate.x);
      eventTargetCoordinateInfo.setWidth(size.width);
    } else {
      eventTargetCoordinateInfo.setX(currentMouseRenderCoordinate.x + size.width - mouseDelta.x);
      eventTargetCoordinateInfo.setWidth(-size.width);
    }

    if (mouseDelta.y >= 0) {
      eventTargetCoordinateInfo.setY(editingStartedRenderCoordinate.y);
      eventTargetCoordinateInfo.setHeight(size.height);
    } else {
      eventTargetCoordinateInfo.setY(currentMouseRenderCoordinate.y + size.height - mouseDelta.y);
      eventTargetCoordinateInfo.setHeight(-size.height);
    }

    graphicEditInfoContainer.requestRerenderEditPreviewLayer(ctx);

    return true;
  }

  @boundMethod
  public override onMouseUp(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();
    const editableContext = ctx.getEditableContext();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    const proxryLayerInfoContainer = editableContext.getProxyLayerInfoContainer();

    const eventState = editableContext.getEventState();

    const prevEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();

    proxryLayerInfoContainer.disableAppAreaProxyLayer();

    if (
      prevEventSubState === GraphicEditEventSubStateEnum.PRESSED ||
      prevEventSubState === GraphicEditEventSubStateEnum.DRAG
    ) {
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.RELEASED);
    }

    if (this.isMouseUpValid(eventState, graphicEditInfoContainer) === false) {
      const props = {
        commandId: CommandEnum.GRAPHIC_INSERT_ABORT,
      };
      editableContext.setCommandProps(props);

      return true;
    }

    if (prevEventSubState === GraphicEditEventSubStateEnum.PRESSED) {
      this.setXYWithoutMove(graphicEditInfoContainer);
    }

    const props = {
      commandId: CommandEnum.GRAPHIC_INSERT,
    };

    editableContext.setCommandProps(props);

    return true;
  }

  @boundMethod
  public override onAppAreaDrag(event: MouseEvent, ctx: AppContext): boolean {
    return this.onDrag(event, ctx);
  }

  @boundMethod
  public override onAppAreaMouseUp(event: MouseEvent, ctx: AppContext): boolean {
    return this.onMouseUp(event, ctx);
  }

  @boundMethod
  public override onKeyDown(event: KeyEvent, ctx: AppContext): boolean {
    switch (true) {
      case /^Escape$/.test(event.getKey()): {
        const editableContext = ctx.getEditableContext();
        const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
        graphicEditInfoContainer.abortCurrentEditingState();
        const props = {
          commandId: CommandEnum.GRAPHIC_INSERT_ABORT,
        };
        editableContext.setCommandProps(props);
        break;
      }
      default: {
        break;
      }
    }

    event.stopPropagation();
    return true;
  }

  @boundMethod
  public override onKeyUp(event: KeyEvent, ctx: AppContext): boolean {
    event.stopPropagation();
    return true;
  }

  private setXYWithoutMove(graphicEditInfoContainer: GraphicEditInfoContainer): void {
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();
    if (eventTargetGraphicModel !== undefined) {
      const eventTargetCoordinateInfo = eventTargetGraphicModel.getCoordinateInfo();

      const editingStartedRenderCoordinate =
        graphicEditInfoContainer.getEditingStartedRenderCoordinate();

      eventTargetCoordinateInfo.setX(editingStartedRenderCoordinate.x);
      eventTargetCoordinateInfo.setY(editingStartedRenderCoordinate.y);
    }
  }

  protected isMouseDownValid(
    eventState: EventStateEnum,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): boolean {
    const eventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const graphic = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (
      eventState !== EventStateEnum.GRAPHIC_INSERT ||
      eventSubState !== GraphicEditEventSubStateEnum.READY ||
      graphic === undefined
    ) {
      return false;
    }
    return true;
  }

  private isMouseMoveValid(
    eventState: EventStateEnum,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): boolean {
    const eventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();

    if (
      eventState !== EventStateEnum.GRAPHIC_INSERT ||
      eventSubState !== GraphicEditEventSubStateEnum.DRAG
    ) {
      return false;
    }
    return true;
  }

  private isMouseUpValid(
    eventState: EventStateEnum,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): boolean {
    const eventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const graphic = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (
      eventState !== EventStateEnum.GRAPHIC_INSERT ||
      eventSubState !== GraphicEditEventSubStateEnum.RELEASED ||
      graphic === undefined
    ) {
      return false;
    }
    return true;
  }
}

export default GraphicInsertEventHandler;
