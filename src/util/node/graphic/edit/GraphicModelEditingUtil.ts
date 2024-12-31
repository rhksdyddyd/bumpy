import GraphicModel from 'model/node/graphic/GraphicModel';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import AppContext from 'store/context/AppContext';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import { CommandEnum } from 'types/store/command/CommandEnum';

export function getSelectedGraphicModelList(
  selectionContainer: SelectionContainer
): GraphicModel[] {
  return selectionContainer.getGraphicModelSelectionContainer().getSelectedGraphicModels();
}

export function getEditingTargetGraphicModelList(
  selectionContainer: SelectionContainer,
  graphicEditInfoContainer: GraphicEditInfoContainer,
  isSelectedGraphicModel: boolean,
  filterFunction: Nullable<(graphicModel: GraphicModel) => boolean>
): GraphicModel[] {
  const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();
  const eventTargetGraphicModelList = eventTargetGraphicModel ? [eventTargetGraphicModel] : [];

  const editingTargetGraphicModelList = isSelectedGraphicModel
    ? getSelectedGraphicModelList(selectionContainer)
    : eventTargetGraphicModelList;

  return filterGraphicModelList(editingTargetGraphicModelList, filterFunction);
}

export function collectEditingTargetGraphicModelList(
  selectionContainer: SelectionContainer,
  graphicEditInfoContainer: GraphicEditInfoContainer,
  isSelectedGraphicModel: boolean,
  filterFunction: Nullable<(graphicModel: GraphicModel) => boolean>
): void {
  const editingTargetGraphicModelList = getEditingTargetGraphicModelList(
    selectionContainer,
    graphicEditInfoContainer,
    isSelectedGraphicModel,
    filterFunction
  );

  editingTargetGraphicModelList.forEach(graphicModel => {
    graphicEditInfoContainer.appendEditingGraphicModel(graphicModel);
  });
}

export function collectEditingDependentGraphicModelList(
  graphicEditInfoContainer: GraphicEditInfoContainer
): void {
  const editingDependentGraphicModelSet = new Set<GraphicModel>();

  graphicEditInfoContainer.getEditingGraphicModelList().forEach(graphicModel => {
    editingDependentGraphicModelSet.add(graphicModel);
  });

  editingDependentGraphicModelSet.forEach(graphicModel => {
    graphicEditInfoContainer.appendEditingDependentGraphicModelEditRequest(graphicModel);
  });
}

export function collectEditPreviewLayerGraphicModelList(
  graphicEditInfoContainer: GraphicEditInfoContainer
): void {
  const editPreviewLayerGraphicModelList = new Array<GraphicModel>();

  graphicEditInfoContainer.getEditingGraphicModelList().forEach(graphicModel => {
    editPreviewLayerGraphicModelList.push(graphicModel);
  });

  // TODO
  // sort in tree order

  editPreviewLayerGraphicModelList.forEach(graphicModel => {
    graphicEditInfoContainer.appendEditPreviewLayerGraphicModel(graphicModel);
  });
}

export function clearGraphicEditContext(ctx: AppContext): void {
  const editableContext = ctx.getEditableContext();
  const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
  const proxryLayerInfoContainer = editableContext.getProxyLayerInfoContainer();

  editableContext.setEventState(EventStateEnum.IDLE);
  graphicEditInfoContainer.setIsBeingEditedToAllEditingDependentGraphicModels(false);
  graphicEditInfoContainer.clear();
  graphicEditInfoContainer.requestRerenderEditPreviewLayer(ctx);

  proxryLayerInfoContainer.disableAppAreaProxyLayer();
  proxryLayerInfoContainer.disableEditViewProxyLayer();
}

export function updateNewSelectionContainer(
  ctx: AppContext,
  graphicModelList: Nullable<GraphicModel[]>
): void {
  const editableContext = ctx.getEditableContext();
  const oldSelectionContainer = editableContext.getSelectionContainer();

  const selectionTargetList =
    graphicModelList ??
    oldSelectionContainer.getGraphicModelSelectionContainer().getSelectedGraphicModels();

  const newSelectionContainer = editableContext.createSelectionContainer();
  selectionTargetList.forEach(graphicModel => {
    newSelectionContainer.getGraphicModelSelectionContainer().appendTreeNode(graphicModel);
  });

  const commandProps = editableContext.getCommandProps() ?? { commandId: CommandEnum.INVALID };
  editableContext.setCommandProps({ ...commandProps, newSelectionContainer });
}

function filterGraphicModelList(
  graphicModelList: GraphicModel[],
  filterFunction: Nullable<(graphicModel: GraphicModel) => boolean>
): GraphicModel[] {
  if (filterFunction === undefined) {
    return graphicModelList;
  }

  return graphicModelList.filter(filterFunction);
}
