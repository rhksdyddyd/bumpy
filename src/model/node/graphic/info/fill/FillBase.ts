import { FillTypeEnum } from 'types/model/node/graphic/FillTypeEnum';

/**
 * 도형의 채우기 정보를 담고있는 class 입니다.
 */
export default abstract class FillBase {
  /**
   * 도형의 채우기 type을 반환합니다.
   */
  public abstract getType(): FillTypeEnum;

  /**
   * react component에서 사용할 수 있도록 fill을 string으로 변환하여 반환합니다.
   */
  public abstract getFillString(): string;

  /**
   * 이 class 를 복사하여 반환합니다.
   */
  public abstract clone(): FillBase;
}
