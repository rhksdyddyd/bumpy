import React, { useLayoutEffect, useRef } from 'react';
import classNames from 'classnames';
import useAppStore from 'hook/store/useAppStore';
import useRerender from 'hook/store/useRerender';
import { EditViewSizeTrackerId } from 'types/component/frame/workarea/edit/EditViewTypes';
import TreeNodeFactoryComponent from 'component/node/factory/TreeNodeFactoryComponent';

import styles from 'scss/component/frame/workarea/edit/EditView.module.scss';

const EditViewComponent = (): React.JSX.Element => {
  const { triggerRerender } = useRerender();
  const ref = useRef<HTMLDivElement>(null);
  const appStore = useAppStore();
  const viewModeContainer = appStore.getAppContext().getEditableContext().getViewModeContainer();
  const zoomRatio = viewModeContainer.getZoomRatio();

  useLayoutEffect(() => {
    if (ref.current !== null) {
      viewModeContainer.setEditViewSizeTrackerRef(ref);
      viewModeContainer.setRerenderEditViewFunction(triggerRerender);
    }
  }, []);

  const treeNodeRoot = appStore.getAppContext().getEditableContext().getTreeNodeRoot();

  return (
    <div className={classNames(styles.container)}>
      <div id={EditViewSizeTrackerId} className={classNames(styles.size_tracker)} />
      <div ref={ref} className={classNames(styles.contents)}>
        <TreeNodeFactoryComponent
          model={treeNodeRoot}
          zoomRatio={zoomRatio}
          isEditPreviewLayer={false}
        />
      </div>
    </div>
  );
};

export default EditViewComponent;
