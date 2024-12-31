import { boundMethod } from 'autobind-decorator';
import GraphicModel from 'model/node/graphic/GraphicModel';
import { GraphicEditingHandleEnum } from 'types/store/container/edit/GraphicEditingHandleEnum';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import { IPoint } from 'types/common/geometry/GeometryTypes';
import AppContext from 'store/context/AppContext';
import { ICursorInfo } from 'types/common/cursor/CursorTypes';
import GraphicModelEditRequest from './GraphicModelEditRequest';

class GraphicEditInfoContainer {
  // selection
  private isMultiSelectionEvent: boolean;

  private isSelectionRecentlyUpdated: boolean;

  private rangeSelectionStratPosition: IPoint;

  private rangeSelectionEndPosition: IPoint;

  // editing
  private cursorInfo: Nullable<ICursorInfo>;

  private eventTargetGraphicModel: Nullable<GraphicModel>;

  private graphicEditEventSubState: GraphicEditEventSubStateEnum;

  private graphicEditingHandle: Nullable<GraphicEditingHandleEnum>;

  private editingStartedRenderCoordinate: IPoint;

  private editingGraphicModelList: Array<GraphicModel>;

  private editingDependentGraphicModelEditRequestMap: Map<GraphicModel, GraphicModelEditRequest>;

  private editPreviewLayerGraphicModelList: Array<GraphicModel>;

  /**
   * rerender를 요청하는 함수입니다.
   */
  private editPreviewLayerRerenderTrigger: Nullable<() => void>;

  private selectionLayerRerenderTrigger: Nullable<() => void>;

  public constructor() {
    // selection
    this.isMultiSelectionEvent = false;
    this.isSelectionRecentlyUpdated = false;
    this.rangeSelectionStratPosition = { x: 0, y: 0 };
    this.rangeSelectionEndPosition = { x: 0, y: 0 };

    // editing
    this.cursorInfo = undefined;
    this.eventTargetGraphicModel = undefined;
    this.graphicEditEventSubState = GraphicEditEventSubStateEnum.NONE;
    this.graphicEditingHandle = undefined;
    this.editingStartedRenderCoordinate = { x: 0, y: 0 };
    this.editingGraphicModelList = new Array<GraphicModel>();
    this.editingDependentGraphicModelEditRequestMap = new Map<
      GraphicModel,
      GraphicModelEditRequest
    >();
    this.editPreviewLayerGraphicModelList = new Array<GraphicModel>();
    this.editPreviewLayerRerenderTrigger = undefined;
    this.selectionLayerRerenderTrigger = undefined;
  }

  public clear(): void {
    // selection
    this.isMultiSelectionEvent = false;
    this.isSelectionRecentlyUpdated = false;
    this.rangeSelectionStratPosition = { x: 0, y: 0 };
    this.rangeSelectionEndPosition = { x: 0, y: 0 };

    // editing
    this.eventTargetGraphicModel = undefined;
    this.graphicEditEventSubState = GraphicEditEventSubStateEnum.NONE;
    this.graphicEditingHandle = undefined;
    this.editingStartedRenderCoordinate = { x: 0, y: 0 };
    this.editingGraphicModelList = new Array<GraphicModel>();
    this.editingDependentGraphicModelEditRequestMap = new Map<
      GraphicModel,
      GraphicModelEditRequest
    >();
    this.editPreviewLayerGraphicModelList = new Array<GraphicModel>();
  }

  // selection
  @boundMethod
  public getIsMultiSelectionEvent(): boolean {
    return this.isMultiSelectionEvent;
  }

  public setIsMultiSelectionEvent(isMultiSelection: boolean): void {
    this.isMultiSelectionEvent = isMultiSelection;
  }

  @boundMethod
  public getIsSelectionRecentlyUpdated(): boolean {
    return this.isSelectionRecentlyUpdated;
  }

  @boundMethod
  public setIsSelectionRecentlyUpdated(isSelectionRecentlyUpdated: boolean): void {
    this.isSelectionRecentlyUpdated = isSelectionRecentlyUpdated;
  }

  @boundMethod
  public getRangeSelectionStartPosition(): IPoint {
    return this.rangeSelectionStratPosition;
  }

  @boundMethod
  public setRangeSelectionStartPosition(rangeSelectionStratPosition: IPoint): void {
    this.rangeSelectionStratPosition = rangeSelectionStratPosition;
  }

  @boundMethod
  public getRangeSelectionEndPosition(): IPoint {
    return this.rangeSelectionEndPosition;
  }

  @boundMethod
  public setRangeSelectionEndPosition(rangeSelectionEndPosition: IPoint): void {
    this.rangeSelectionEndPosition = rangeSelectionEndPosition;
  }

  // editing
  @boundMethod
  public getCursorInfo(): Nullable<ICursorInfo> {
    return this.cursorInfo;
  }

  @boundMethod
  public setCursorInfo(cursorInfo: Nullable<ICursorInfo>): void {
    this.cursorInfo = cursorInfo;
  }

  @boundMethod
  public getEventTargetGraphicModel(): Nullable<GraphicModel> {
    return this.eventTargetGraphicModel;
  }

  @boundMethod
  public setEventTargetGraphicModel(graphicModel: Nullable<GraphicModel>): void {
    this.eventTargetGraphicModel = graphicModel;
  }

  @boundMethod
  public getGraphicEditEventSubState(): GraphicEditEventSubStateEnum {
    return this.graphicEditEventSubState;
  }

  @boundMethod
  public setGraphicEditEventSubState(graphicEditEventSubState: GraphicEditEventSubStateEnum): void {
    this.graphicEditEventSubState = graphicEditEventSubState;
  }

  @boundMethod
  public getGraphicEditingHandle(): Nullable<GraphicEditingHandleEnum> {
    return this.graphicEditingHandle;
  }

  @boundMethod
  public setGraphicEditingHandle(handle: GraphicEditingHandleEnum): void {
    this.graphicEditingHandle = handle;
  }

  @boundMethod
  public getEditingStartedRenderCoordinate(): IPoint {
    return this.editingStartedRenderCoordinate;
  }

  @boundMethod
  public setEditingStartedRenderCoordinate(coordinate: IPoint): void {
    this.editingStartedRenderCoordinate = coordinate;
  }

  @boundMethod
  public appendEditingGraphicModel(graphicModel: GraphicModel): void {
    this.editingGraphicModelList.push(graphicModel);
  }

  @boundMethod
  public clearEditingGraphicModelList(): void {
    this.editingGraphicModelList = [];
  }

  @boundMethod
  public getEditingGraphicModelList(): Array<GraphicModel> {
    return this.editingGraphicModelList;
  }

  @boundMethod
  public appendEditingDependentGraphicModelEditRequest(graphicModel: GraphicModel): void {
    if (this.editingDependentGraphicModelEditRequestMap.has(graphicModel)) {
      return;
    }

    this.editingDependentGraphicModelEditRequestMap.set(
      graphicModel,
      new GraphicModelEditRequest(graphicModel)
    );
  }

  @boundMethod
  public clearEditingDependentGraphicModelEditRequest(): void {
    this.editingDependentGraphicModelEditRequestMap = new Map();
  }

  @boundMethod
  public getEditingDependentGraphicModelEditRequest(
    graphicModel: GraphicModel
  ): Nullable<GraphicModelEditRequest> {
    return this.editingDependentGraphicModelEditRequestMap.get(graphicModel);
  }

  @boundMethod
  public getEditingDependentGraphicModelEditRequestMap(): Map<
    GraphicModel,
    GraphicModelEditRequest
  > {
    return this.editingDependentGraphicModelEditRequestMap;
  }

  @boundMethod
  public appendEditPreviewLayerGraphicModel(graphicModel: GraphicModel): void {
    this.editPreviewLayerGraphicModelList.push(graphicModel);
  }

  @boundMethod
  public getEditPreviewLayerGraphicModelList(): Array<GraphicModel> {
    return this.editPreviewLayerGraphicModelList;
  }

  @boundMethod
  public clearEditPreviewLayerGraphicModelList(): void {
    this.editPreviewLayerGraphicModelList = [];
  }

  @boundMethod
  public setIsBeingEditedToAllEditingDependentGraphicModels(isBeingEdited: boolean): void {
    this.getEditingDependentGraphicModelEditRequestMap().forEach(graphicModelEditRequest => {
      graphicModelEditRequest.getGraphicModel().setIsBeingEdited(isBeingEdited);
    });
    this.editPreviewLayerGraphicModelList.forEach(graphicModel => {
      graphicModel.setIsBeingEdited(isBeingEdited);
    });
  }

  @boundMethod
  public abortCurrentEditingState(): void {
    this.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.ABORT);
    this.setIsBeingEditedToAllEditingDependentGraphicModels(false);
  }

  @boundMethod
  public setEditPreviewLayerRerenderTrigger(
    editPreviewLayerRerenderTrigger: Nullable<() => void>
  ): void {
    this.editPreviewLayerRerenderTrigger = editPreviewLayerRerenderTrigger;
  }

  @boundMethod
  public requestRerenderEditPreviewLayer(ctx: AppContext): void {
    if (this.editPreviewLayerRerenderTrigger !== undefined) {
      ctx.getEditableContext().appendRerenderTrigger(this.editPreviewLayerRerenderTrigger);
    }
  }

  @boundMethod
  public setSelectionLayerRerenderTrigger(
    selectionLayerRerenderTrigger: Nullable<() => void>
  ): void {
    this.selectionLayerRerenderTrigger = selectionLayerRerenderTrigger;
  }

  @boundMethod
  public requestRerenderSelectionLayer(ctx: AppContext): void {
    if (this.selectionLayerRerenderTrigger !== undefined) {
      ctx.getEditableContext().appendRerenderTrigger(this.selectionLayerRerenderTrigger);
    }
  }

  @boundMethod
  public isEditingActivated(): boolean {
    return this.graphicEditEventSubState === GraphicEditEventSubStateEnum.DRAG;
  }
}

export default GraphicEditInfoContainer;
