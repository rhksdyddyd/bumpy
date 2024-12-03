import { ShapeTypeEnum } from './ShapeTypeEnum';

/**
 * PathBuilder 가 path 를 생성하기 필요한 정보입니다.
 * PathBuilder.build()의 인자로 사용합니다.
 */
export interface IGeometryParam {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * PathBuilder에서 생성하는 Path의 기본 type 입니다.
 */
export interface IPath {
  d: string;
  fill: string;
  stroke: string;
}

/**
 * PresetGeometry의 경우에 대한 정보입니다.
 */
export interface IPresetGeometry {
  shapeType: ShapeTypeEnum;
}

/**
 * CustomGeometry에 대한 정보입니다.
 */
export interface ICustomGeometry {
  pathList: IPath[];
}
