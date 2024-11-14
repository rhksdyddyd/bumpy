import { boundMethod } from 'autobind-decorator';
import GraphicModel from 'node/Graphic/GraphicModel';
import { ISelection } from 'selection/InternalSelectionContainer';

/**
 * 개별 graphicModel의 selection을 담당하는 class 입니다.
 */
export default class GraphicModelSelection implements ISelection {
    /**
     * 선택되어있는 model
     */
    private selectedModel: GraphicModel;

    /**
     * 생성자
     *
     * @param graphicModel 이 GraphicModelSelection에서 관리 할 graphicModel
     */
    public constructor(graphicModel: GraphicModel) {
        this.selectedModel = graphicModel;
    }

    /**
     * selection이 관리하는 selectedModel을 반환합니다.
     *
     * @returns selectedModel
     */
    @boundMethod
    public getModel(): GraphicModel {
        return this.selectedModel;
    }

    /**
     * 자신을 복사하여 반환합니다.
     *
     * @returns 복사한 graphicModelSelection
     */
    @boundMethod
    public clone(): GraphicModelSelection {
        return new GraphicModelSelection(this.selectedModel);
    }
}
