import { boundMethod } from 'autobind-decorator';
import { ICustomGeometry, IGeometryParam, IPresetGeometry, Path, ShapeTypeEnum } from 'graphic/GraphicTypes';
import PathBuilder from 'graphic/path/PathBuilder';
import { cloneDeep } from 'lodash';

/**
 * path의 정보를 가지고 있는 class 입니다.
 */
export default class PathInfo {
    /**
     * shapetype이 preset 종류인 경우에 대한 정보를 담고 있습니다.
     */
    private prstGeom: Nullable<IPresetGeometry>;

    /**
     * shapetype이 custom인 경우에 대한 정보를 담고 있습니다.
     */
    private custGeom: Nullable<ICustomGeometry>;

    /**
     * 실제로 path를 계산해서 반환하는 class 입니다.
     */
    private pathBuilder: Nullable<PathBuilder>;

    /**
     * 생성자
     */
    constructor() {
        this.prstGeom = undefined;
        this.custGeom = undefined;
        this.pathBuilder = undefined;
    }

    /**
     * preset 도형 정보를 설정합니다.
     *
     * @param prstGeom preset 도형 정보
     */
    @boundMethod
    public setPrstGeom(prstGeom: Nullable<IPresetGeometry>): void {
        this.prstGeom = prstGeom;
    }

    /**
     * preset 도형 정보를 반환합니다.
     *
     * @returns preset 도형 정보
     */
    @boundMethod
    public getPrstGeom(): Nullable<IPresetGeometry> {
        return this.prstGeom;
    }

    /**
     * custom 도형 정보를 설정합니다.
     *
     * @param custGeom custom 도형 정보
     */
    @boundMethod
    public setCustGeom(custGeom: Nullable<ICustomGeometry>): void {
        this.custGeom = custGeom;
    }

    /**
     * custom 도형 정보를 반환합니다.
     *
     * @returns custom 도형 정보
     */
    @boundMethod
    public getCustGeom(): Nullable<ICustomGeometry> {
        return this.custGeom;
    }

    /**
     * 도형의 path를 생성하는 PathBuilder를 설정합니다.
     * 도형 type이 변경되었을 경우 사용합니다.
     *
     * @param pathBuilder 도형의 path를 생성하는 PathBuilder
     */
    @boundMethod
    public setPathBuilder(pathBuilder: Nullable<PathBuilder>) {
        this.pathBuilder = pathBuilder;
    }

    /**
     * 도형의 path를 생성하는 PathBuilder를 반환합니다.
     *
     * @returns 도형의 path를 생성하는 PathBuilder
     */
    @boundMethod
    public getPathBuilder(): Nullable<PathBuilder> {
        return this.pathBuilder;
    }

    /**
     * 도형의 type을 반환합니다.
     *
     * @returns 도형의 type
     */
    @boundMethod
    public getShapeType(): ShapeTypeEnum {
        return this.prstGeom?.shapeType || ShapeTypeEnum.CUSTOM;
    }

    /**
     * 도형의 path를 생성하여 반환합니다.
     *
     * @param param 도형의 크기, 위치 정보를 담고있는 객체
     * @returns 새롭게 생성한 도형의 path 정보
     */
    @boundMethod
    public getPath(param: IGeometryParam): Path[] {
        return this.pathBuilder?.build(param) || [];
    }

    /**
     * pathinfo를 복사하여 반환합니다.
     *
     * @returns 새로 복사한 path info
     */
    @boundMethod
    public clone(): PathInfo {
        const newPathInfo = new PathInfo();

        if (this.prstGeom !== undefined) {
            newPathInfo.setPrstGeom(cloneDeep(this.prstGeom));
            newPathInfo.setPathBuilder(this.pathBuilder);
        } else if (this.custGeom !== undefined) {
            newPathInfo.setCustGeom(cloneDeep(this.custGeom));
            newPathInfo.setPathBuilder(this.pathBuilder);
        }

        return newPathInfo;
    }
}
