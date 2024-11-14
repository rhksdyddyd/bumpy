import TreeNode from 'node/TreeNode';
import TreeNodeTypeEnum from 'node/TreeNodeTypeEnum';

export default class SlideModel extends TreeNode {
    /**
     * 너비
     */
    private w: number;

    /**
     * 높이
     */
    private h: number;

    /**
     * 생성자
     *
     * @param id 개체에 부여 할 id
     */
    constructor(id: number) {
        super(id);
        this.w = 800;
        this.h = 500;
    }

    /**
     * SlideModel의 TreeNode로서 type을 반환합니다.
     *
     * @returns slide model임을 알려주는 TreeNodeTypeEnum
     */
    public getTreeNodeType(): TreeNodeTypeEnum {
        return TreeNodeTypeEnum.SLIDE;
    }

    /**
     * 크기를 반환합니다.
     *
     * @returns SlideModel의 너비와 높이 정보
     */
    public getSize(): { w: number; h: number } {
        return { w: this.w, h: this.h };
    }
}
