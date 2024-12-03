import { IGeometryParam, IPath } from 'types/model/node/graphic/GraphicTypes';
import { makeLine, makeMove } from 'util/node/graphic/path/PathUtil';

/**
 * svg path를 생성하는 base class 입니다.
 */
export default abstract class PathBuilder {
  /**
   * path 정보
   */
  pathList: IPath[] = [];

  /**
   * SVG path 정보를 생성합니다.
   *
   * @param param PathBuilder 가 path 를 생성하기 위해 참고해야 하는 도형 정보
   * @returns SVG path
   */
  public abstract build(param: IGeometryParam): IPath[];

  /**
   * 현재 x 좌표
   */
  curX = 0;

  /**
   * 현재 y 좌표
   */
  curY = 0;

  /**
   * move 정보를 담는 string을 반환합니다.
   *
   * @param x 도착 지점 x
   * @param y 도착 지점 y
   * @returns move 정보를 담는 string
   */
  public makeMove(x: number, y: number): string {
    this.curX = x;
    this.curY = y;
    return makeMove(x, y);
  }

  /**
   * line 정보를 담는 string을 반환합니다.
   *
   * @param x 도착 지점 x
   * @param y 도착 지점 y
   * @returns line 정보를 담는 string
   */
  public makeLine(x: number, y: number): string {
    this.curX = x;
    this.curY = y;
    return makeLine(x, y);
  }
}
