import PathBuilder from 'model/node/graphic/info/path/PathBuilder';
import { IGeometryParam, IPath } from 'types/model/node/graphic/GraphicTypes';

/**
 * 사각형 모양의 path를 그리는 PathBuilder
 */
export default class PrstRectBuilder extends PathBuilder {
  /**
   * SVG path 정보를 생성합니다.
   *
   * @param param PathBuilder 가 path 를 생성하기 위해 참고해야 하는 도형 정보
   * @returns SVG path
   */
  public build(param: IGeometryParam): IPath[] {
    // common
    const l = 0;
    const r = param.width;
    const b = param.height;
    const t = 0;

    // pathLst
    this.pathList = [];
    let drawing = ``;
    let fill = ``;
    let stroke = ``;

    // path
    fill = `default`;
    stroke = `default`;
    drawing = ``;
    drawing += this.makeMove(l, t);
    drawing += this.makeLine(r, t);
    drawing += this.makeLine(r, b);
    drawing += this.makeLine(l, b);
    drawing += `Z`;
    this.pathList.push({ d: drawing, fill, stroke });

    return this.pathList;
  }
}
