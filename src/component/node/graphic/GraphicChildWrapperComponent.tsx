import useAppStore from 'hook/store/useAppStore';
import GraphicModel from 'model/node/graphic/GraphicModel';
import React from 'react';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';
import { getDisplayedSize } from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';
import styles from 'scss/component/node/graphic/GraphicChildWrapper.module.scss';
import classNames from 'classnames';
import useRenderChildren from 'hook/component/node/useRenderChildren';

const GraphicChildWrapperComponent = (props: TreeNodeComponentProps): React.JSX.Element => {
  const { model, zoomRatio, isEditPreviewLayer } = props;
  const graphicModel = model as GraphicModel;

  const { renderedChildren } = useRenderChildren(props);

  const appStore = useAppStore();
  const graphicEditInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getGraphicEditInfoContainer();

  const size = getDisplayedSize(graphicEditInfoContainer, graphicModel, isEditPreviewLayer);

  return (
    <div
      className={classNames(styles.container)}
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    >
      {renderedChildren}
    </div>
  );
};

export default GraphicChildWrapperComponent;
