import { IGeometryParam, IPath } from 'types/model/node/graphic/GraphicTypes';
import PathBuilder from './PathBuilder';

class EventRectBuilder extends PathBuilder {
  public build(param: IGeometryParam): IPath[] {
    // common
    const l = param.x;
    const r = param.x + param.width;
    const b = param.y + param.height;
    const t = param.y;

    // pathLst
    this.pathList = [];
    let drawing = ``;
    const fill = ``;
    const stroke = ``;

    drawing += this.makeMove(l, t);
    drawing += this.makeLine(r, t);
    drawing += this.makeLine(r, b);
    drawing += this.makeLine(l, b);
    drawing += `Z`;
    this.pathList.push({ d: drawing, fill, stroke });

    return this.pathList;
  }
}
export default EventRectBuilder;
