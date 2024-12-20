import Color from 'model/color/Color';
import FillBase from 'model/node/graphic/info/fill/FillBase';
import { FillTypeEnum } from 'types/model/node/graphic/FillTypeEnum';

/**
 * 단일 색으로 채우는 경우에 대한 class 입니다.
 */
export default class SolidFill extends FillBase {
  /**
   * solidfill로 채울 색 입니다.
   */
  private color: Color;

  /**
   * 생성자
   *
   * @param color solid fill에서 표현 할 색
   */
  constructor(color: Color) {
    super();
    this.color = color;
  }

  /**
   * 도형의 채우기 type을 반환합니다.
   *
   * FillType.SOLID_FILL
   */
  public getType(): FillTypeEnum {
    return FillTypeEnum.SOLID_FILL;
  }

  /**
   * react component에서 사용할 수 있도록 fill을 string으로 변환하여 반환합니다.
   *
   * @returns color를 hex로 변환한 값
   */
  public getFillString(): string {
    return this.color.getColorString();
  }

  /**
   * 이 class를 복사하여 반환합니다.
   *
   * @returns 복사한 solid fill
   */
  public clone(): FillBase {
    return new SolidFill(this.color.clone());
  }

  /**
   * 색상을 지정합니다.
   *
   * @param color 새롭게 바꿀 색상
   */
  public setColor(color: Color): void {
    this.color = color;
  }

  /**
   * solidfill이 가지고 있는 color를 반환합니다.
   *
   * @returns solidFill이 가지고 있는 색상
   */
  public getColor(): Color {
    return this.color;
  }
}
