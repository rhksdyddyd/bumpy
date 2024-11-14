/**
 * 도형의 채우기 정보를 나타내는 type입니다
 */
export enum FillType {
    NO_FILL,
    SOLID_FILL,
}

/**
 * 도형의 채우기 정보를 담고있는 class 입니다.
 */
export default abstract class FillBase {
    /**
     * 도형의 채우기 type을 반환합니다.
     */
    public abstract getType(): FillType;

    /**
     * react component에서 사용할 수 있도록 fill을 string으로 변환하여 반환합니다.
     */
    public abstract getFillString(): string;

    /**
     * 이 class 를 복사하여 반환합니다.
     */
    public abstract clone(): FillBase;
}
