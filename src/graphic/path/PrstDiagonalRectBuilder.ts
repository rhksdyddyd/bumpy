import { IGeometryParam, Path } from 'graphic/GraphicTypes';
import PathBuilder from 'graphic/path/PathBuilder';

/**
 * 대각선으로 사각형 2개가 있는 모양의 path를 그리는 PathBuilder
 */
export default class PrstDiagonalRectBuilder extends PathBuilder {
    /**
     * SVG path 정보를 생성합니다.
     *
     * @param param PathBuilder 가 path 를 생성하기 위해 참고해야 하는 도형 정보
     * @returns SVG path
     */
    public build(param: IGeometryParam): Path[] {
        // common
        const l = 0;
        const r = param.width / 2;
        const b = param.height / 2;
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

        drawing = ``;
        drawing += this.makeMove(r, b);
        drawing += this.makeLine(r, 2 * b);
        drawing += this.makeLine(2 * r, 2 * b);
        drawing += this.makeLine(2 * r, b);
        drawing += `Z`;
        this.pathList.push({ d: drawing, fill, stroke });

        return this.pathList;
    }
}
