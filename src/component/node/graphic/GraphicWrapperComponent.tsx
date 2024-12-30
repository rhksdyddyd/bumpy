import React from 'react';
import classNames from 'classnames';
import useAppStore from 'hook/store/useAppStore';
import GraphicModel from 'model/node/graphic/GraphicModel';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';
import { getGraphicWrapperCoordinateStyle } from 'util/node/graphic/component/GraphicWrapperComponentUtil';

import styles from 'scss/component/node/graphic/GraphicWrapper.module.scss';
import GraphicComponent from './GraphicComponent';
import GraphicChildWrapperComponent from './GraphicChildWrapperComponent';

const GraphicWrapperComponent = (props: TreeNodeComponentProps): React.JSX.Element => {
  const { model, zoomRatio, isEditPreviewLayer } = props;
  const graphicModel = model as GraphicModel;
  const isBeingEdited = graphicModel.getIsBeingEdited();

  const appStore = useAppStore();
  const graphicEditInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getGraphicEditInfoContainer();

  const isVisible = isEditPreviewLayer === true || isBeingEdited === false;

  if (isVisible === false) {
    return <></>;
  }

  const coordinateStyle = getGraphicWrapperCoordinateStyle(
    graphicEditInfoContainer,
    graphicModel,
    isEditPreviewLayer
  );

  return (
    <div
      className={classNames(styles.container)}
      style={{
        ...coordinateStyle,
      }}
    >
      <GraphicComponent {...props} />
      <GraphicChildWrapperComponent {...props} />
    </div>
  );
};

export default GraphicWrapperComponent;
