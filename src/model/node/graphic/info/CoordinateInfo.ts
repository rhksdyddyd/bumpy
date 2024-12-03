import { boundMethod } from 'autobind-decorator';

// GraphicModel의 Coordinate 관련 정보를 가지는 class 입니다.
export default class CoordinateInfo {
  /**
   * x 좌표
   */
  private x: number;

  /**
   * y 좌표
   */
  private y: number;

  /**
   * 너비
   */
  private width: number;

  /**
   * 높이
   */
  private height: number;

  /**
   * 회전값
   */
  private rotation: number;

  /**
   * 도형의 회전이 0일 때를 기준으로, 가로 방향으로 filp 되어있는 지의 여부
   */
  private flipH: boolean;

  /**
   * 도형의 회전이 0일 때를 기준으로, 세로 방향으로 filp 되어있는 지의 여부
   */
  private flipV: boolean;

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 x 좌표
   */
  private groupX: number;

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 y 좌표
   */
  private groupY: number;

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 너비
   */
  private groupWidth: number;

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 높이
   */
  private groupHeight: number;

  /**
   * 생성자
   */
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.flipH = false;
    this.flipV = false;
    this.groupX = 0;
    this.groupY = 0;
    this.groupWidth = 0;
    this.groupHeight = 0;
  }

  /**
   * x 좌표를 설정합니다.
   *
   * @param x 도형의 x 좌표
   */
  @boundMethod
  public setX(x: number): void {
    this.x = x;
  }

  /**
   * x 좌표를 반환합니다.
   *
   * @returns 도형의 x 좌표
   */
  @boundMethod
  public getX(): number {
    return this.x;
  }

  /**
   * y 좌표를 설정합니다.
   *
   * @param y 도형의 y 좌표
   */
  @boundMethod
  public setY(y: number): void {
    this.y = y;
  }

  /**
   * y 좌표를 반환합니다.
   *
   * @returns 도형의 y 좌표
   */
  @boundMethod
  public getY(): number {
    return this.y;
  }

  /**
   * 너비를 설정합니다.
   *
   * @param width 도형의 너비
   */
  @boundMethod
  public setWidth(width: number): void {
    this.width = width;
  }

  /**
   * 너비를 반환합니다.
   *
   * @returns 도형의 너비
   */
  @boundMethod
  public getWidth(): number {
    return this.width;
  }

  /**
   * 높이를 설정합니다.
   *
   * @param height 도형의 높이
   */
  @boundMethod
  public setHeight(height: number): void {
    this.height = height;
  }

  /**
   * 높이를 반환합니다.
   *
   * @returns 도형의 높이
   */
  @boundMethod
  public getHeight(): number {
    return this.height;
  }

  /**
   * 도형의 회전값을 설정합니다.
   *
   * @param rotation 도형의 회전값
   */
  @boundMethod
  public setRotation(rotation: number): void {
    this.rotation = rotation;
  }

  /**
   * 도형의 회전값을 반환합니다.
   *
   * @returns 도형의 회전값
   */
  @boundMethod
  public getRotation(): number {
    return this.rotation;
  }

  /**
   * 도형의 가로방향 반전 상태를 설정합니다.
   *
   * @param flipH 도형의 가로방향 반전 상태
   */
  @boundMethod
  public setFlipH(flipH: boolean): void {
    this.flipH = flipH;
  }

  /**
   * 도형의 가로방향 반전 상태를 반환합니다.
   *
   * @returns 도형의 가로방향 반전 상태
   */
  @boundMethod
  public getFlipH(): boolean {
    return this.flipH;
  }

  /**
   * 도형의 세로방향 반전 상태를 설정합니다.
   *
   * @param flipV 도형의 세로방향 반전 상태
   */
  @boundMethod
  public setFlipV(flipV: boolean): void {
    this.flipV = flipV;
  }

  /**
   * 도형의 세로방향 반전 상태를 반환합니다.
   *
   * @returns 도형의 세로방향 반전 상태
   */
  @boundMethod
  public getFlipV(): boolean {
    return this.flipV;
  }

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 x 좌표를 설정합니다.
   *
   * @param groupX 도형 묶음을 처음 group으로 하였을 때 group의 x 좌표
   */
  @boundMethod
  public setGroupX(groupX: number): void {
    this.groupX = groupX;
  }

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 x 좌표를 반환합니다.
   *
   * @returns 도형 묶음을 처음 group으로 하였을 때 group의 x 좌표
   */
  @boundMethod
  public getGroupX(): number {
    return this.groupX;
  }

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 y 좌표를 설정합니다.
   *
   * @param groupY 도형 묶음을 처음 group으로 하였을 때 group의 y 좌표
   */
  @boundMethod
  public setGroupY(groupY: number): void {
    this.groupY = groupY;
  }

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 y 좌표를 반환합니다.
   *
   * @returns 도형 묶음을 처음 group으로 하였을 때 group의 y 좌표
   */
  @boundMethod
  public getGroupY(): number {
    return this.groupY;
  }

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 너비를 설정합니다.
   *
   * @param groupWidth 도형 묶음을 처음 group으로 하였을 때 group의 너비
   */
  @boundMethod
  public setGroupWidth(groupWidth: number): void {
    this.groupWidth = groupWidth;
  }

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 너비를 반환합니다.
   *
   * @returns 도형 묶음을 처음 group으로 하였을 때 group의 너비
   */
  @boundMethod
  public getGroupWidth(): number {
    return this.groupWidth;
  }

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 높이를 설정합니다.
   *
   * @param groupHeight 도형 묶음을 처음 group으로 하였을 때 group의 높이
   */
  @boundMethod
  public setGroupHeight(groupHeight: number): void {
    this.groupHeight = groupHeight;
  }

  /**
   * group에서만 사용합니다.
   * 도형 묶음을 처음 group으로 하였을 때 group의 높이를 반환합니다.
   *
   * @returns 도형 묶음을 처음 group으로 하였을 때 group의 높이
   */
  @boundMethod
  public getGroupHeight(): number {
    return this.groupHeight;
  }

  /**
   * coordinateinfo를 복사하여 반환합니다.
   *
   * @returns 새롭게 복사 된 coordinate info
   */
  @boundMethod
  public clone(): CoordinateInfo {
    const newCoordinateInfo = new CoordinateInfo();

    newCoordinateInfo.setX(this.x);
    newCoordinateInfo.setY(this.y);
    newCoordinateInfo.setWidth(this.width);
    newCoordinateInfo.setHeight(this.height);
    newCoordinateInfo.setRotation(this.rotation);
    newCoordinateInfo.setFlipH(this.flipH);
    newCoordinateInfo.setFlipV(this.flipV);
    newCoordinateInfo.setGroupX(this.groupX);
    newCoordinateInfo.setGroupY(this.groupY);
    newCoordinateInfo.setGroupWidth(this.groupWidth);
    newCoordinateInfo.setGroupHeight(this.groupHeight);

    return newCoordinateInfo;
  }
}
