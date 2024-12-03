import TreeNode from 'model/node/TreeNode';
import { TreeNodeTypeEnum } from 'types/model/node/TreeNodeTypeEnum';

export default class SlideModel extends TreeNode {
  /**
   * 너비
   */
  private width: number;

  /**
   * 높이
   */
  private height: number;

  /**
   * 생성자
   *
   * @param id 개체에 부여 할 id
   */
  constructor(id: number) {
    super(id);
    this.width = 800;
    this.height = 500;
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
  public getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}
