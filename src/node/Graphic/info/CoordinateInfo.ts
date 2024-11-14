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
    private w: number;

    /**
     * 높이
     */
    private h: number;

    /**
     * 회전값
     */
    private rot: number;

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
    private groupW: number;

    /**
     * group에서만 사용합니다.
     * 도형 묶음을 처음 group으로 하였을 때 group의 높이
     */
    private groupH: number;

    /**
     * 생성자
     */
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.rot = 0;
        this.flipH = false;
        this.flipV = false;
        this.groupX = 0;
        this.groupY = 0;
        this.groupW = 0;
        this.groupH = 0;
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
     * @param w 도형의 너비
     */
    @boundMethod
    public setW(w: number): void {
        this.w = w;
    }

    /**
     * 너비를 반환합니다.
     *
     * @returns 도형의 너비
     */
    @boundMethod
    public getW(): number {
        return this.w;
    }

    /**
     * 높이를 설정합니다.
     *
     * @param w 도형의 높이
     */
    @boundMethod
    public setH(h: number): void {
        this.h = h;
    }

    /**
     * 높이를 반환합니다.
     *
     * @returns 도형의 높이
     */
    @boundMethod
    public getH(): number {
        return this.h;
    }

    /**
     * 도형의 회전값을 설정합니다.
     *
     * @param rot 도형의 회전값
     */
    @boundMethod
    public setRotation(rot: number): void {
        this.rot = rot;
    }

    /**
     * 도형의 회전값을 반환합니다.
     *
     * @returns 도형의 회전값
     */
    @boundMethod
    public getRotation(): number {
        return this.rot;
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
     * @param groupX 도형 묶음을 처음 group으로 하였을 때 group의 y 좌표
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
     * @param groupX 도형 묶음을 처음 group으로 하였을 때 group의 너비
     */
    @boundMethod
    public setGroupW(groupW: number): void {
        this.groupW = groupW;
    }

    /**
     * group에서만 사용합니다.
     * 도형 묶음을 처음 group으로 하였을 때 group의 너비를 반환합니다.
     *
     * @returns 도형 묶음을 처음 group으로 하였을 때 group의 너비
     */
    @boundMethod
    public getGroupW(): number {
        return this.groupW;
    }

    /**
     * group에서만 사용합니다.
     * 도형 묶음을 처음 group으로 하였을 때 group의 높이를 설정합니다.
     *
     * @param groupX 도형 묶음을 처음 group으로 하였을 때 group의 높이
     */
    @boundMethod
    public setGroupH(groupH: number): void {
        this.groupH = groupH;
    }

    /**
     * group에서만 사용합니다.
     * 도형 묶음을 처음 group으로 하였을 때 group의 높이를 반환합니다.
     *
     * @returns 도형 묶음을 처음 group으로 하였을 때 group의 높이
     */
    @boundMethod
    public getGroupH(): number {
        return this.groupH;
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
        newCoordinateInfo.setW(this.w);
        newCoordinateInfo.setH(this.h);
        newCoordinateInfo.setRotation(this.rot);
        newCoordinateInfo.setFlipH(this.flipH);
        newCoordinateInfo.setFlipV(this.flipV);
        newCoordinateInfo.setGroupX(this.groupX);
        newCoordinateInfo.setGroupY(this.groupY);
        newCoordinateInfo.setGroupW(this.groupW);
        newCoordinateInfo.setGroupH(this.groupH);

        return newCoordinateInfo;
    }
}
