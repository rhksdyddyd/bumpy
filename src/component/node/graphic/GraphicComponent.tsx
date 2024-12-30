import useGraphicComponentEventListener from 'hook/component/node/graphic/useGraphicComponentEventListener';
import useAppStore from 'hook/store/useAppStore';
import GraphicModel from 'model/node/graphic/GraphicModel';
import React from 'react';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';
import { IPath } from 'types/model/node/graphic/GraphicTypes';
import {
  getEventSVG,
  getRenderSVG,
  makeFillGetterFunction,
  makeStrokeFillGetterFunction,
} from 'util/node/graphic/component/GraphicComponentUtil';
import { getDisplayedSize } from 'util/node/graphic/coordinate/GraphicModelCoordinateUtil';

const GraphicComponent = (props: TreeNodeComponentProps): React.JSX.Element => {
  const { model, zoomRatio, isEditPreviewLayer } = props;
  const graphicModel = model as GraphicModel;

  const appStore = useAppStore();
  const graphicEditInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getGraphicEditInfoContainer();

  const size = getDisplayedSize(graphicEditInfoContainer, graphicModel, isEditPreviewLayer);

  const pathInfo = graphicModel.getPathInfo();

  const pathList =
    pathInfo !== undefined
      ? pathInfo.getPath({
          x: 0,
          y: 0,
          width: size.width,
          height: size.height,
        })
      : [];

  const { handleMouseDown } = useGraphicComponentEventListener(graphicModel);

  const hasFill = graphicModel.getFillInfo()?.getFill()?.getFillString() !== 'transparent';
  const pointerEvents = hasFill ? 'all' : 'stroke';

  const extraEventWidth = 15;
  const cursor = 'move';

  const eventSVG = getEventSVG(
    size,
    pathList,
    graphicModel.getStrokeInfo()?.getWidth() ?? 1,
    extraEventWidth,
    pointerEvents,
    cursor,
    handleMouseDown
  );

  const fillType = graphicModel.getFillInfo()?.getFillType();
  const defaultFill = graphicModel.getFillInfo()?.getFill()?.getFillString() ?? '';
  const getFillFunction = makeFillGetterFunction(fillType, defaultFill);

  const strokeFillType = graphicModel.getStrokeInfo()?.getFill()?.getType();
  const defaultStrokeFill = graphicModel.getStrokeInfo()?.getFill()?.getFillString() ?? '';
  const getStrokeFillFunction = makeStrokeFillGetterFunction(strokeFillType, defaultStrokeFill);

  const renderSVG = getRenderSVG(
    size,
    pathList,
    graphicModel.getStrokeInfo()?.getWidth(),
    getFillFunction,
    getStrokeFillFunction,
    isEditPreviewLayer
  );

  return (
    <>
      {renderSVG}
      {eventSVG}
    </>
  );
};

export default GraphicComponent;
