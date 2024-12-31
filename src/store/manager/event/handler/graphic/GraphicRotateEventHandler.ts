import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import {
  collectEditingDependentGraphicModelList,
  collectEditingTargetGraphicModelList,
  collectEditPreviewLayerGraphicModelList,
  updateNewSelectionContainer,
} from 'util/node/graphic/edit/GraphicModelEditingUtil';
import { ResourceEnum } from 'types/resource/ResourceEnum';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import { CommandEnum } from 'types/store/command/CommandEnum';
import {
  applyRotationToGraphicEditRequest,
  getInitialEditingDisplayedCenterCoordinate,
  getInitialEditingDisplayedFlipH,
  getInitialEditingDisplayedFlipV,
  updateEditingDependentTreeMember,
} from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';
import { convertClientCoordinateToRenderCoordinate } from 'util/coordinate/RenderCoordinateUtil';
import { getAngleBetweenThreePoints } from 'util/coordinate/CoordinateUtil';
import { GraphicEditingHandleEnum } from 'types/store/container/edit/GraphicEditingHandleEnum';
import EventHandler from '../EventHandler';
import MouseEvent from '../../wrapper/MouseEvent';
import KeyEvent from '../../wrapper/KeyEvent';

export default class GraphicRotateEventHandler extends EventHandler {
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
      graphicEditInfoContainer.getGraphicEditingHandle() !== GraphicEditingHandleEnum.ROTATE ||
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

    this.setUpGraphicModelRotateContext(
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

    const editingStartedRenderCoordinate =
      graphicEditInfoContainer.getEditingStartedRenderCoordinate();

    const currentMouseRenderCoordinate = convertClientCoordinateToRenderCoordinate(
      { x: event.getClientX(), y: event.getClientY() },
      zoomRatio
    );

    const eventTargetCenterCoordinate = getInitialEditingDisplayedCenterCoordinate(
      graphicEditInfoContainer,
      eventTargetGraphicModel
    );

    const rotatedAngle = getAngleBetweenThreePoints(
      editingStartedRenderCoordinate,
      currentMouseRenderCoordinate,
      eventTargetCenterCoordinate
    );

    const editingGraphicModelList = graphicEditInfoContainer.getEditingGraphicModelList();

    editingGraphicModelList.forEach(graphicModel => {
      const graphicModelEditRequest =
        graphicEditInfoContainer.getEditingDependentGraphicModelEditRequest(graphicModel);
      let angleDirection = 1;

      if (graphicModelEditRequest !== undefined) {
        const initialCoordinateInfo = graphicModelEditRequest.getInitialCoordinateInfo();

        const parentFlipH =
          getInitialEditingDisplayedFlipH(graphicEditInfoContainer, graphicModel) !==
          initialCoordinateInfo.getFlipH();
        const parentFlipV =
          getInitialEditingDisplayedFlipV(graphicEditInfoContainer, graphicModel) !==
          initialCoordinateInfo.getFlipV();

        if (parentFlipH !== parentFlipV) {
          angleDirection = -1;
        }
      }
      applyRotationToGraphicEditRequest(
        graphicEditInfoContainer,
        graphicModel,
        rotatedAngle * angleDirection,
        event.isShiftDown()
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
        commandId: CommandEnum.GRAPHIC_ROTATE_ABORT,
      };
      editableContext.setCommandProps(commandProps);

      return true;
    }

    updateEditingDependentTreeMember(graphicEditInfoContainer);

    const commandProps = {
      commandId: CommandEnum.GRAPHIC_ROTATE,
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
    switch (true) {
      case /^Escape$/.test(event.getKey()): {
        const editableContext = ctx.getEditableContext();
        const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
        graphicEditInfoContainer.abortCurrentEditingState();
        const props = {
          commandId: CommandEnum.GRAPHIC_ROTATE_ABORT,
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
      eventState !== EventStateEnum.GRAPHIC_ROTATE ||
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
      eventState !== EventStateEnum.GRAPHIC_ROTATE ||
      graphicEditEventSubState !== GraphicEditEventSubStateEnum.DRAG ||
      selectionContainer === undefined ||
      selectionContainer.getGraphicModelSelectionContainer() === undefined
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
      eventState !== EventStateEnum.GRAPHIC_ROTATE ||
      graphicEditEventSubState !== GraphicEditEventSubStateEnum.RELEASED ||
      eventTargetGraphicModel === undefined
    ) {
      return false;
    }
    return true;
  }

  private setUpGraphicModelRotateContext(
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
    ctx
      .getEditableContext()
      .getProxyLayerInfoContainer()
      .enableAppAreaProxyLayer(
        eventTargetGraphicModel,
        {
          cursorType: 'img',
          img: ResourceEnum.IMG_CURSOR_ROTATE,
          position: {
            x: 15,
            y: 15,
          },
        },
        true,
        false
      );
    graphicEditInfoContainer.getEditPreviewLayerGraphicModelList().forEach(graphicModel => {
      graphicModel.requestRerender(ctx);
    });
    graphicEditInfoContainer.requestRerenderSelectionLayer(ctx);
  }
}
