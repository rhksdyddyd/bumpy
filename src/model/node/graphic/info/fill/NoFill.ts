import FillBase from 'model/node/graphic/info/fill/FillBase';
import { FillTypeEnum } from 'types/component/node/graphic/FillTypeEnum';

/**
 * '채우기 없음' 상태의 정보를 나타내는 class 입니다.
 */
export default class NoFill extends FillBase {
  /**
   * 도형의 채우기 type을 반환합니다.
   *
   * @returns FillType.NO_FILL
   */
  public getType(): FillTypeEnum {
    return FillTypeEnum.NO_FILL;
  }

  /**
   * react component에서 사용할 수 있도록 fill을 string으로 변환하여 반환합니다.
   *
   * @returns 'transparent'
   */
  public getFillString(): string {
    return 'transparent';
  }

  /**
   * 이 class 를 복사하여 반환합니다.
   *
   * @returns 복사한 NoFill
   */
  public clone(): FillBase {
    return new NoFill();
  }
}
