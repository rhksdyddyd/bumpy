import useAppStore from 'hook/store/useAppStore';
import useRerender from 'hook/store/useRerender';
import React, { useLayoutEffect } from 'react';
import styles from 'scss/component/node/slide/EditPreviewLayer.module.scss';
import classNames from 'classnames';
import TreeNodeFactoryComponent from '../../factory/TreeNodeFactoryComponent';

const EditPreviewlayerComponent = (): React.JSX.Element => {
  const { triggerRerender } = useRerender();
  const appStore = useAppStore();

  const graphicEditInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getGraphicEditInfoContainer();

  useLayoutEffect(() => {
    graphicEditInfoContainer.setEditPreviewLayerRerenderTrigger(triggerRerender);

    return () => {
      graphicEditInfoContainer.setEditPreviewLayerRerenderTrigger(undefined);
    };
  });

  const viewModeContainer = appStore.getAppContext().getEditableContext().getViewModeContainer();
  const zoomRatio = viewModeContainer.getZoomRatio();
  const isEditPreivewLayerActivated = graphicEditInfoContainer.isEditingActivated();

  return (
    <div className={classNames(styles.conatiner)}>
      {isEditPreivewLayerActivated &&
        graphicEditInfoContainer.getEditPreviewLayerGraphicModelList().map(treeNode => {
          return (
            <TreeNodeFactoryComponent
              key={treeNode.getId()}
              model={treeNode}
              zoomRatio={zoomRatio}
              isEditPreviewLayer
            />
          );
        })}
    </div>
  );
};

export default EditPreviewlayerComponent;
