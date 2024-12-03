import { boundMethod } from 'autobind-decorator';
import { PresetColorMap } from 'resource/color/PresetColorMap';
import { ColorType } from 'types/model/color/ColorTypes';

/**
 * 색상 정보를 관리하는 class 입니다.
 */
export default class Color {
  /**
   * 색상의 type
   */
  private colorType: ColorType;

  /**
   * 색상의 실제 값
   */
  private value: string;

  /**
   * 생성자
   *
   * @param colorType 색상의 type
   * @param value 색상의 실제 값
   */
  constructor(colorType: ColorType, value: string) {
    this.colorType = colorType;
    this.value = value;
  }

  /**
   *  실제 사용 할 수 있는 color를 반환합니다.
   *
   *  @return #000000 형식의 HEX 색상코드
   */
  @boundMethod
  public getColorString(): string {
    let color: string;

    switch (this.colorType) {
      case ColorType.SRGB:
        color = `#${this.value}`;
        break;
      case ColorType.PRESET:
        color = PresetColorMap.get(this.value) ?? '#ffffff';
        break;
      default:
        color = '#afafaf';
        break;
    }

    // 색상표현 양식에 맞는지 확인 (ex. #ffffff)
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
      color = '#cdcdcd';
    }

    return color;
  }

  /**
   * color 개체를 복사하여 반환합니다.
   *
   * @returns 복사한 color 개체
   */
  @boundMethod
  public clone(): Color {
    return new Color(this.colorType, this.value);
  }
}
