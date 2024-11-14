import { boundMethod } from 'autobind-decorator';
import FillBase, { FillType } from 'style/fill/FillBase';

/**
 * 도형의 채우기 정보를 관리하는 class 입니다.
 * fillBase는 변경될 수 있습니다.
 */
export default class FillInfo {
    /**
     * Fill 종류에 따라 각각의 정보를 담아둘 수 있는 객체
     */
    private fill: Nullable<FillBase>;

    /**
     * 생성자
     */
    constructor() {
        this.fill = undefined;
    }

    /**
     * fill을 설정합니다.
     *
     * @param fill 새롭게 설정 할 fill
     */
    @boundMethod
    public setFill(fill: Nullable<FillBase>): void {
        this.fill = fill;
    }

    /**
     * FillInfo가 관리하는 fill을 반환합니다.
     *
     * @returns FillInfo에서 관리하는 fill
     */
    @boundMethod
    public getFill(): Nullable<FillBase> {
        return this.fill;
    }

    /**
     * 내부에서 관리하는 fill의 type을 반환합니다.
     *
     * @returns fill의 type
     */
    public getFillType(): Nullable<FillType> {
        return this.fill?.getType();
    }

    /**
     * 이 class 를 복사하여 반환합니다.
     * @returns 복사한 FillInfo
     */
    public clone(): FillInfo {
        const newFillInfo = new FillInfo();
        newFillInfo.setFill(this.fill?.clone());
        return newFillInfo;
    }
}
