import { boundMethod } from 'autobind-decorator';
import { ShapeTypeEnum } from 'graphic/GraphicTypes';
import PathBuilder from 'graphic/path/PathBuilder';
import PrstDiagonalRectBuilder from 'graphic/path/PrstDiagonalRectBuilder';
import PrstRectBuilder from 'graphic/path/PrstRectBuilder';

/**
 * Path 를 생성하는 PathBuilder를 생성합니다.
 * PathBuilderFactory 는 싱글톤으로 존재합니다.
 */
class PathBuilderFactory {
    /**
     * 사각형
     */
    private prstRectBuilder?: PathBuilder;

    /**
     * 대각선으로 사각형 2개가 있는 모양
     */
    private prstDiagonalRectBuilder?: PathBuilder;

    /**
     * 생성자
     */
    constructor() {
        this.prstRectBuilder = undefined;
        this.prstDiagonalRectBuilder = undefined;
    }

    /**
     * shapeType에 맞는 PathBuilder를 생성하여 반환합니다.
     * 일반적인 pathBuilder의 경우 instance를 재활용하지만,
     * CustomPathBuilder의 경우 각 도형이 서로 다른 instance를 가져야 합니다.
     *
     * @param shapeType path가 필요한 도형의 type
     * @returns shapeType에 맞는 pathBuilder
     */
    @boundMethod
    public createPathBuilder(shapeType: ShapeTypeEnum): PathBuilder {
        switch (shapeType) {
            case ShapeTypeEnum.RECT:
                if (this.prstRectBuilder === undefined) {
                    this.prstRectBuilder = new PrstRectBuilder();
                }
                return this.prstRectBuilder;
            case ShapeTypeEnum.DIAGONAL_RECT:
                if (this.prstDiagonalRectBuilder === undefined) {
                    this.prstDiagonalRectBuilder = new PrstDiagonalRectBuilder();
                }
                return this.prstDiagonalRectBuilder;
            default:
                // 기본을 일단 'rect'
                if (this.prstRectBuilder === undefined) {
                    this.prstRectBuilder = new PrstRectBuilder();
                }
                return this.prstRectBuilder;
        }
    }
}

export default new PathBuilderFactory();
