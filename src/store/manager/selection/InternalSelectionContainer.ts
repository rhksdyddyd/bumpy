import TreeNode from 'model/node/TreeNode';

/**
 * selection container 의 내부에서 각 type별 node의 selection을 담당하는 class 입니다.
 */
export default abstract class InternalSelectionContainer {
  /**
   * selection에 포함할 수 있는지 검사하는 함수입니다.
   * 대상 node 뿐 아니라 대상 node의 자식을 포함하여야 하는 경우
   * (appendTreeNode에서 해당 case를 처리해야 하는 경우)도
   * 포함하여 고려합니다.
   *
   * @param treeNode selection으로 포함할 수 있는지 검사할 대상
   */
  public abstract isRelatedModel(treeNode: TreeNode): boolean;

  /**
   * selection array에 treeNode를 추가합니다.
   * isRelatedModel로 확인된 treeNode만 들어옵니다.
   *
   * @param selection 추가 할 treeNode
   */
  public abstract appendTreeNode(treeNode: TreeNode): void;

  /**
   * Container가 Selection을 가지고 있는지 여부
   */
  public abstract hasSelection(): boolean;

  /**
   * 현재 Select된 models
   */
  public abstract getSelectedModels(): TreeNode[];
}
