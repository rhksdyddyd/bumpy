import { boundMethod } from 'autobind-decorator';
import FillBase from 'model/node/graphic/info/fill/FillBase';
import { FillTypeEnum } from 'types/model/node/graphic/FillTypeEnum';

/**
 * 도형의 윤곽선 정보를 담고있는 class입니다.
 */
export default class StrokeInfo {
  /**
   * 채우기 속성
   */
  private fill: Nullable<FillBase>;

  /**
   * 윤곽선 두께
   */
  private width: Nullable<number>;

  /**
   * 생성자
   */
  constructor() {
    this.fill = undefined;
    this.width = undefined;
  }

  /**
   * 채우기 속성을 반환합니다.
   *
   * @returns 윤곽선의 채우기 속성
   */
  @boundMethod
  public getFill(): Nullable<FillBase> {
    return this.fill;
  }

  /**
   * 채우기 속성을 설정합니다.
   *
   * @param fill 설정 할 채우기 속성
   */
  @boundMethod
  public setFill(fill: Nullable<FillBase>): void {
    this.fill = fill;
  }

  /**
   * 윤곽선의 FillType을 반환합니다.
   *
   * @returns 윤곽선의 FillType
   */
  @boundMethod
  public getFillType(): Nullable<FillTypeEnum> {
    return this.fill?.getType();
  }

  /**
   * 윤곽선 두께를 반환합니다.
   *
   * @returns 윤곽선 두께
   */
  @boundMethod
  public getWidth(): Nullable<number> {
    return this.width;
  }

  /**
   * 윤곽선 두께를 설정합니다.
   *
   * @param width 설정 할 윤곽선 두께
   */
  @boundMethod
  public setWidth(width: Nullable<number>): void {
    this.width = width;
  }

  /**
   * StrokeInfo를 복사하여 반환합니다.
   *
   * @returns 새롭게 복사한 StrokeInfo
   */
  @boundMethod
  public clone(): StrokeInfo {
    const newStrokeInfo = new StrokeInfo();

    newStrokeInfo.setFill(this.fill?.clone());
    newStrokeInfo.setWidth(this.width);

    return newStrokeInfo;
  }
}
