import GraphicModel from 'model/node/graphic/GraphicModel';
import FillInfo from 'model/node/graphic/info/FillInfo';
import PathBuilderFactory from 'model/node/graphic/info/path/PathBuilderFactory';
import PathInfo from 'model/node/graphic/info/PathInfo';
import { ShapeTypeEnum } from 'types/model/node/graphic/ShapeTypeEnum';
import IdGenerator from 'util/id/IdGenerator';
import StrokeInfo from 'model/node/graphic/info/StrokeInfo';
import { createDefaultFill, createDefaultStrokeFill } from './style/FillStyleUtil';

export function createGraphicModelForInsertCommand(shapeType: ShapeTypeEnum): GraphicModel {
  const graphicModel = new GraphicModel(IdGenerator.generateId());

  const pathInfo = new PathInfo();
  pathInfo.setPrstGeom({ shapeType });
  pathInfo.setPathBuilder(PathBuilderFactory.createPathBuilder(shapeType));
  graphicModel.setPathInfo(pathInfo);

  const fillInfo = new FillInfo();
  fillInfo.setFill(createDefaultFill());
  graphicModel.setFillInfo(fillInfo);

  const strokeInfo = new StrokeInfo();
  strokeInfo.setFill(createDefaultStrokeFill());
  strokeInfo.setWidth(3);
  graphicModel.setStrokeInfo(strokeInfo);

  const coordinateInfo = graphicModel.getCoordinateInfo();

  coordinateInfo.setWidth(100);
  coordinateInfo.setHeight(100);

  graphicModel.setIsBeingEdited(true);

  return graphicModel;
}
