import useAppStore from 'hook/store/useAppStore';
import useRerender from 'hook/store/useRerender';
import GraphicModel from 'model/node/graphic/GraphicModel';
import React, { useLayoutEffect } from 'react';
import { getRootGroup, isGroupChild } from 'util/node/graphic/GraphicModelTreeNodeUtil';
import GraphicSelectionComponent from './graphic/GraphicSelectionComponent';

const SelectionLayerComponent = (): React.JSX.Element => {
  const { triggerRerender } = useRerender();
  const appStore = useAppStore();

  const graphicEditInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getGraphicEditInfoContainer();

  useLayoutEffect(() => {
    graphicEditInfoContainer.setSelectionLayerRerenderTrigger(triggerRerender);

    return () => {
      graphicEditInfoContainer.setSelectionLayerRerenderTrigger(undefined);
    };
  });

  if (graphicEditInfoContainer.isEditPreivewLayerActivated() === true) {
    return <></>;
  }

  const selectionContainer = appStore.getAppContext().getEditableContext().getSelectionContainer();
  const selectedGraphicModels = selectionContainer
    .getGraphicModelSelectionCotnainer()
    .getSelectedGraphicModels();

  let extraSelectionTarget: Nullable<GraphicModel>;

  selectedGraphicModels.some(graphicModel => {
    if (isGroupChild(graphicModel) === true) {
      extraSelectionTarget = getRootGroup(graphicModel);
    }
    return true;
  });

  return (
    <>
      {extraSelectionTarget !== undefined && (
        <GraphicSelectionComponent graphicModel={extraSelectionTarget} isDirectlySelected={false} />
      )}
      {selectedGraphicModels.map(graphicModel => {
        return <GraphicSelectionComponent graphicModel={graphicModel} isDirectlySelected />;
      })}
    </>
  );
};

export default SelectionLayerComponent;
