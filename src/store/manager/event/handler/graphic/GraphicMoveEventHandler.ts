import { boundMethod } from 'autobind-decorator';
import * as math from 'mathjs';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import AppContext from 'store/context/AppContext';
import {
  collectEditingDependentGraphicModelList,
  collectEditingTargetGraphicModelList,
  collectEditPreviewLayerGraphicModelList,
} from 'util/node/graphic/edit/GraphicModelEditingUtil';
import GraphicModel from 'model/node/graphic/GraphicModel';
import { CommandEnum } from 'types/store/command/CommandEnum';
import {
  applyGraphicMoveDeltaToGraphicEditRequest,
  updateEditingDependentTreeMember,
} from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';
import { IPoint } from 'types/common/geometry/GeometryTypes';
import { convertClientCoordinateToRenderCoordinate } from 'util/coordinate/RenderCoordinateUtil';
import EventHandler from '../EventHandler';
import MouseEvent from '../../wrapper/MouseEvent';
import KeyEvent from '../../wrapper/KeyEvent';

class GraphicMoveEventHandler extends EventHandler {
  @boundMethod
  public override onDrag(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();

    const editableContext = ctx.getEditableContext();

    const eventState = editableContext.getEventState();
    const selectionContainer = editableContext.getSelectionContainer();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    if (
      graphicEditInfoContainer.getGraphicEditEventSubState() ===
      GraphicEditEventSubStateEnum.PRESSED
    ) {
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.DRAG);
      this.setUpGraphicModelMoveContext(ctx, selectionContainer, graphicEditInfoContainer);
    }

    const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    if (this.isMouseMoveValid(eventState, graphicEditInfoContainer) === false) {
      if (graphicEditEventSubState !== GraphicEditEventSubStateEnum.ABORT) {
        graphicEditInfoContainer.abortCurrentEditingState();
      }
      return true;
    }

    const moveDelta = this.calculateMouseDelta(ctx, graphicEditInfoContainer, event);

    const editingGraphicModelList = graphicEditInfoContainer.getEditingGraphicModelList();
    this.applyMoveDelta(graphicEditInfoContainer, editingGraphicModelList, moveDelta);

    graphicEditInfoContainer.requestRerenderEditPreviewLayer(ctx);
    return true;
  }

  @boundMethod
  public override onMouseUp(event: MouseEvent, ctx: AppContext): boolean {
    const editableContext = ctx.getEditableContext();
    const eventState = editableContext.getEventState();
    const selectionContainer = editableContext.getSelectionContainer();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    if (
      graphicEditInfoContainer.getGraphicEditEventSubState() === GraphicEditEventSubStateEnum.DRAG
    ) {
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.RELEASED);
    }

    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();
    if (eventTargetGraphicModel === undefined) {
      return true;
    }

    if (this.isMouseUpValid(eventState, graphicEditInfoContainer, selectionContainer) === false) {
      const props = {
        commandId: CommandEnum.GRAPHIC_MOVE_ABORT,
      };
      editableContext.setCommandProps(props);

      return true;
    }

    const moveDelta = this.calculateMouseDelta(ctx, graphicEditInfoContainer, event);
    const editingGraphicModelList = graphicEditInfoContainer.getEditingGraphicModelList();
    this.applyMoveDelta(graphicEditInfoContainer, editingGraphicModelList, moveDelta);

    updateEditingDependentTreeMember(graphicEditInfoContainer);

    const props = {
      commandId: CommandEnum.GRAPHIC_MOVE,
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
    // ToDo. ctrl event, alt event 처리 zoom ratio get
    switch (true) {
      case /^Escape$/.test(event.getKey()): {
        const editableContext = ctx.getEditableContext();
        const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
        graphicEditInfoContainer.abortCurrentEditingState();
        const props = {
          commandId: CommandEnum.GRAPHIC_MOVE_ABORT,
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

  private calculateMouseDelta(
    ctx: AppContext,
    graphicEditInfoContainer: GraphicEditInfoContainer,
    event: MouseEvent
  ): IPoint {
    const zoomRatio = ctx.getEditableContext().getViewModeContainer().getZoomRatio();

    const editingStartedRenderCoordinate =
      graphicEditInfoContainer.getEditingStartedRenderCoordinate();

    const currentMouseRenderCoordinate = convertClientCoordinateToRenderCoordinate(
      { x: event.getClientX(), y: event.getClientY() },
      zoomRatio
    );

    let mouseDeltaX = currentMouseRenderCoordinate.x - editingStartedRenderCoordinate.x;
    let mouseDeltaY = currentMouseRenderCoordinate.y - editingStartedRenderCoordinate.y;

    if (event.isShiftDown() === true) {
      if (math.abs(mouseDeltaX) >= math.abs(mouseDeltaY)) {
        mouseDeltaY = 0;
      } else {
        mouseDeltaX = 0;
      }
    }

    return { x: mouseDeltaX, y: mouseDeltaY };
  }

  public applyMoveDelta(
    graphicEditInfoContainer: GraphicEditInfoContainer,
    graphicModels: GraphicModel[],
    moveDelta: IPoint
  ): void {
    graphicModels.forEach(graphicModel => {
      applyGraphicMoveDeltaToGraphicEditRequest(graphicEditInfoContainer, graphicModel, moveDelta);
    });
  }

  private isMouseMoveValid(
    eventState: EventStateEnum,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): boolean {
    const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (
      eventState !== EventStateEnum.GRAPHIC_MOVE ||
      graphicEditEventSubState !== GraphicEditEventSubStateEnum.DRAG ||
      eventTargetGraphicModel === undefined
    ) {
      return false;
    }
    return true;
  }

  private isMouseUpValid(
    eventState: EventStateEnum,
    graphicEditInfoContainer: GraphicEditInfoContainer,
    selectionContainer: Nullable<SelectionContainer>
  ): boolean {
    const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (
      eventState !== EventStateEnum.GRAPHIC_MOVE ||
      graphicEditEventSubState !== GraphicEditEventSubStateEnum.RELEASED ||
      eventTargetGraphicModel === undefined ||
      selectionContainer === undefined ||
      selectionContainer.getGraphicModelSelectionContainer() === undefined
    ) {
      return false;
    }
    return true;
  }

  private setUpGraphicModelMoveContext(
    ctx: AppContext,
    selectionContainer: SelectionContainer,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): void {
    collectEditingTargetGraphicModelList(
      selectionContainer,
      graphicEditInfoContainer,
      true,
      undefined
    );
    collectEditingDependentGraphicModelList(graphicEditInfoContainer);
    collectEditPreviewLayerGraphicModelList(graphicEditInfoContainer);
    graphicEditInfoContainer.setIsBeingEditedToAllEditingDependentGraphicModels(true);
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();
    ctx
      .getEditableContext()
      .getProxyLayerInfoContainer()
      .enableAppAreaProxyLayer(eventTargetGraphicModel, { cursorType: 'move' }, true, false);
    graphicEditInfoContainer.getEditPreviewLayerGraphicModelList().forEach(graphicModel => {
      graphicModel.requestRerender(ctx);
    });
    graphicEditInfoContainer.requestRerenderSelectionLayer(ctx);
  }
}

export default GraphicMoveEventHandler;
