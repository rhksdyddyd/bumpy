export interface IPoint {
  x: number;
  y: number;
}

export interface ILine {
  from: IPoint;
  to: IPoint;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IResizeRatio {
  widthRatio: number;
  heightRatio: number;
}

export interface IRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface IRectWithCoord {
  x: number;
  y: number;
  width: number;
  height: number;
}
