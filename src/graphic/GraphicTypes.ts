/**
 * 도형의 모양 관련 type을 설정하는 enum 입니다.
 */
export enum ShapeTypeEnum {
    RECT,
    DIAGONAL_RECT,
    CUSTOM,
}

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
export type Path = {
    d: string;
    fill: string;
    stroke: string;
};

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
    pathList: Path[];
}
