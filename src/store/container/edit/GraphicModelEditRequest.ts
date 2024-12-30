import { boundMethod } from 'autobind-decorator';
import GraphicModel from 'model/node/graphic/GraphicModel';
import CoordinateInfo from 'model/node/graphic/info/CoordinateInfo';
import PathInfo from 'model/node/graphic/info/PathInfo';

class GraphicModelEditRequest {
  private graphicModel: GraphicModel;

  private initialCoordinateInfo: CoordinateInfo;

  private initialPathInfo: Nullable<PathInfo>;

  private currentEditingCoordinateInfo: CoordinateInfo;

  private currentEditingPathInfo: Nullable<PathInfo>;

  constructor(graphicModel: GraphicModel) {
    this.graphicModel = graphicModel;

    const coordinateInfo = graphicModel.getCoordinateInfo();
    const pathInfo = graphicModel.getPathInfo();

    this.initialCoordinateInfo = coordinateInfo.clone();
    this.currentEditingCoordinateInfo = coordinateInfo.clone();
    this.initialPathInfo = pathInfo?.clone();
    this.currentEditingPathInfo = pathInfo?.clone();
  }

  @boundMethod
  public getGraphicModel(): GraphicModel {
    return this.graphicModel;
  }

  @boundMethod
  public getInitialCoordinateInfo(): CoordinateInfo {
    return this.initialCoordinateInfo;
  }

  @boundMethod
  public getCurrentEditingCoordinateInfo(): CoordinateInfo {
    return this.currentEditingCoordinateInfo;
  }

  @boundMethod
  public getInitialPathInfo(): Nullable<PathInfo> {
    return this.initialPathInfo;
  }

  @boundMethod
  public getCurrentEditingPathInfo(): Nullable<PathInfo> {
    return this.currentEditingPathInfo;
  }
}

export default GraphicModelEditRequest;
