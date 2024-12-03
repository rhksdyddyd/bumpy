import GraphicModel from 'model/node/graphic/GraphicModel';
import SlideModel from 'model/node/slide/SlideModel';
import TreeNode from 'model/node/TreeNode';
import { TreeNodeTypeEnum } from 'types/model/node/TreeNodeTypeEnum';

/**
 * 주어진 node 가 특정 타입(T)인지를 확인하는 타입 가드 함수입니다.
 *
 * @param node 콘텐츠 타입을 확인하려는 TreeNode
 * @param nodeTypeEnum 확인하려는 node의 type
 * @returns node가 확인하려는 type인지의 여부
 */
const isTreeNodeOfType = <T extends TreeNode>(
  node: Nullable<T>,
  nodeTypeEnum: TreeNodeTypeEnum
): node is T => node?.getTreeNodeType() === nodeTypeEnum;

/**
 * 주어진 node가 GraphicModel인지 확인합니다.
 *
 * @param node 확인하려는 node
 * @returns node가 GraphicModel인지의 여부
 */
export const isSlideModel = (node: Nullable<TreeNode>): node is SlideModel =>
  isTreeNodeOfType(node, TreeNodeTypeEnum.SLIDE);

/**
 * 주어진 node가 GraphicModel인지 확인합니다.
 *
 * @param node 확인하려는 node
 * @returns node가 GraphicModel인지의 여부
 */
export const isGraphicModel = (node: Nullable<TreeNode>): node is GraphicModel =>
  isTreeNodeOfType(node, TreeNodeTypeEnum.GRAPHIC_MODEL);
