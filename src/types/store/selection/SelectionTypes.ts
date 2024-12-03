import TreeNode from 'model/node/TreeNode';

/**
 * selection을 구성하는 기본 interface 입니다.
 */
export interface ISelection {
  getModel(): TreeNode;
}
