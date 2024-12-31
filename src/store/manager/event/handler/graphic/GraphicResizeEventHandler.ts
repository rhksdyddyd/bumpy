import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import {
  collectEditingDependentGraphicModelList,
  collectEditingTargetGraphicModelList,
  collectEditPreviewLayerGraphicModelList,
  updateNewSelectionContainer,
} from 'util/node/graphic/edit/GraphicModelEditingUtil';
import { convertClientCoordinateToRenderCoordinate } from 'util/coordinate/RenderCoordinateUtil';
import GraphicModel from 'model/node/graphic/GraphicModel';
import { IPoint } from 'types/common/geometry/GeometryTypes';
import {
  applyGraphicModelTransformToRenderCoordinate,
  applyResizeRatioToGraphicEditRequest,
  calculateResizeRatio,
  updateEditingDependentTreeMember,
} from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';
import { CommandEnum } from 'types/store/command/CommandEnum';
import MouseEvent from '../../wrapper/MouseEvent';
import EventHandler from '../EventHandler';
import KeyEvent from '../../wrapper/KeyEvent';

export default class GraphicResizeEventHandler extends EventHandler {
  @boundMethod
  public override onMouseDown(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();
    const editableContext = ctx.getEditableContext();

    const eventState = editableContext.getEventState();
    const selectionContainer = editableContext.getSelectionContainer();
    const graphicSelectionContainer = selectionContainer.getGraphicModelSelectionContainer();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    const zoomRatio = editableContext.getViewModeContainer().getZoomRatio();
    const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (
      this.isMouseDownValid(eventState, graphicEditEventSubState) === false ||
      eventTargetGraphicModel === undefined
    ) {
      if (graphicEditEventSubState !== GraphicEditEventSubStateEnum.ABORT) {
        graphicEditInfoContainer.abortCurrentEditingState();
      }

      return true;
    }

    const isSelectedGraphicModel =
      graphicSelectionContainer.hasGraphicModelSelection(eventTargetGraphicModel);

    if (isSelectedGraphicModel === false) {
      // handle이 부모 group handle일 경우 selection 조정
      updateNewSelectionContainer(ctx, [eventTargetGraphicModel]);
    }

    graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.PRESSED);

    const editingStartedRenderCoordinate = convertClientCoordinateToRenderCoordinate(
      { x: event.getClientX(), y: event.getClientY() },
      zoomRatio
    );

    graphicEditInfoContainer.setEditingStartedRenderCoordinate(editingStartedRenderCoordinate);

    this.setUpGraphicModelResizeContext(
      ctx,
      selectionContainer,
      graphicEditInfoContainer,
      isSelectedGraphicModel
    );

    return true;
  }

  @boundMethod
  public override onDrag(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();
    const editableContext = ctx.getEditableContext();

    const eventState = editableContext.getEventState();
    const selectionContainer = editableContext.getSelectionContainer();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    const zoomRatio = editableContext.getViewModeContainer().getZoomRatio();

    if (
      graphicEditInfoContainer.getGraphicEditEventSubState() ===
      GraphicEditEventSubStateEnum.PRESSED
    ) {
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.DRAG);
      graphicEditInfoContainer.setIsBeingEditedToAllEditingDependentGraphicModels(true);
      graphicEditInfoContainer.getEditPreviewLayerGraphicModelList().forEach(graphicModel => {
        graphicModel.requestRerender(ctx);
      });
      graphicEditInfoContainer.requestRerenderSelectionLayer(ctx);
    }

    const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (
      this.isMouseMoveValid(eventState, graphicEditEventSubState, selectionContainer) === false ||
      eventTargetGraphicModel === undefined
    ) {
      if (graphicEditEventSubState !== GraphicEditEventSubStateEnum.ABORT) {
        graphicEditInfoContainer.abortCurrentEditingState();
      }

      return true;
    }

    const appliableMouseDelta = this.calculateAppliableMouseDelta(
      event,
      graphicEditInfoContainer,
      eventTargetGraphicModel,
      zoomRatio
    );

    const resizeRatio = calculateResizeRatio(
      graphicEditInfoContainer,
      eventTargetGraphicModel,
      appliableMouseDelta,
      event.isShiftDown()
    );

    const editingGraphicModelList = graphicEditInfoContainer.getEditingGraphicModelList();

    editingGraphicModelList.forEach(graphicModel => {
      applyResizeRatioToGraphicEditRequest(
        graphicEditInfoContainer,
        graphicModel,
        resizeRatio,
        true
      );
    });

    graphicEditInfoContainer.requestRerenderEditPreviewLayer(ctx);
    return true;
  }

  @boundMethod
  public override onMouseUp(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();
    const editableContext = ctx.getEditableContext();
    const eventState = editableContext.getEventState();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    if (
      graphicEditInfoContainer.getGraphicEditEventSubState() === GraphicEditEventSubStateEnum.DRAG
    ) {
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.RELEASED);
    }

    if (this.isMouseUpValid(eventState, graphicEditInfoContainer) === false) {
      const commandProps = {
        commandId: CommandEnum.GRAPHIC_RESIZE_ABORT,
      };
      editableContext.setCommandProps(commandProps);

      return true;
    }

    updateEditingDependentTreeMember(graphicEditInfoContainer);

    const commandProps = {
      commandId: CommandEnum.GRAPHIC_RESIZE,
    };

    editableContext.setCommandProps(commandProps);

    return true;
  }

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
          commandId: CommandEnum.GRAPHIC_RESIZE_ABORT,
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

  private isMouseDownValid(
    eventState: EventStateEnum,
    graphicEditEventSubState: GraphicEditEventSubStateEnum
  ): boolean {
    if (
      eventState !== EventStateEnum.GRAPHIC_RESIZE ||
      graphicEditEventSubState !== GraphicEditEventSubStateEnum.READY
    ) {
      return false;
    }
    return true;
  }

  private isMouseMoveValid(
    eventState: EventStateEnum,
    graphicEditEventSubState: GraphicEditEventSubStateEnum,
    selectionContainer: Nullable<SelectionContainer>
  ): boolean {
    if (
      eventState !== EventStateEnum.GRAPHIC_RESIZE ||
      graphicEditEventSubState !== GraphicEditEventSubStateEnum.DRAG ||
      selectionContainer?.getGraphicModelSelectionContainer() === undefined
    ) {
      return false;
    }
    return true;
  }

  private isMouseUpValid(
    eventState: EventStateEnum,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): boolean {
    const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();

    if (
      eventState !== EventStateEnum.GRAPHIC_RESIZE ||
      graphicEditEventSubState !== GraphicEditEventSubStateEnum.RELEASED ||
      eventTargetGraphicModel === undefined
    ) {
      return false;
    }
    return true;
  }

  private setUpGraphicModelResizeContext(
    ctx: AppContext,
    selectionContainer: SelectionContainer,
    graphicEditInfoContainer: GraphicEditInfoContainer,
    isSelectedGraphicModel: boolean
  ): void {
    collectEditingTargetGraphicModelList(
      selectionContainer,
      graphicEditInfoContainer,
      isSelectedGraphicModel,
      undefined
    );
    collectEditingDependentGraphicModelList(graphicEditInfoContainer);
    collectEditPreviewLayerGraphicModelList(graphicEditInfoContainer);
    graphicEditInfoContainer.setIsBeingEditedToAllEditingDependentGraphicModels(true);
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();
    ctx.getEditableContext().getProxyLayerInfoContainer().enableAppAreaProxyLayer(
      eventTargetGraphicModel,
      {
        cursorType: 'move',
      },
      true,
      false
    );
  }

  private calculateAppliableMouseDelta(
    event: MouseEvent,
    graphicEditInfoContainer: GraphicEditInfoContainer,
    eventTargetGraphicModel: GraphicModel,
    zoomRatio: number
  ): IPoint {
    const editingStartedRenderCoordinate =
      graphicEditInfoContainer.getEditingStartedRenderCoordinate();

    const currentMouseRenderCoordinate = convertClientCoordinateToRenderCoordinate(
      { x: event.getClientX(), y: event.getClientY() },
      zoomRatio
    );

    const editingStartedPositonBasedOnGraphicModel = applyGraphicModelTransformToRenderCoordinate(
      graphicEditInfoContainer,
      eventTargetGraphicModel,
      editingStartedRenderCoordinate,
      false
    );

    const currentMousePositonBasedOnGraphicModel = applyGraphicModelTransformToRenderCoordinate(
      graphicEditInfoContainer,
      eventTargetGraphicModel,
      currentMouseRenderCoordinate,
      false
    );

    return {
      x: currentMousePositonBasedOnGraphicModel.x - editingStartedPositonBasedOnGraphicModel.x,
      y: currentMousePositonBasedOnGraphicModel.y - editingStartedPositonBasedOnGraphicModel.y,
    };
  }
}
