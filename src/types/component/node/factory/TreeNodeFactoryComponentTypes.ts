import TreeNode from 'model/node/TreeNode';
import { UniqueKey } from 'util/id/Identifiable';

export interface TreeNodeComponentProps {
  model: TreeNode;
  zoomRatio: number;
}

export type CreateTreeNodeComponentFunctionType = (
  props: TreeNodeComponentProps
) => React.JSX.Element;

export type TreeNodeComponentMapType = Map<UniqueKey, CreateTreeNodeComponentFunctionType>;

// export interface TreeNodeComponentDefaultProps {
//   model: TreeNode;
// }수

// export type CreateTreeNodeComponentFunctionType<T extends TreeNodeComponentDefaultProps> = (
//   props: T
// ) => React.JSX.Element;

// export type CreateComponentWrapperType = (
//   callback: <T extends TreeNodeComponentDefaultProps>(
//     createTreeNodeComponentFunction: CreateTreeNodeComponentFunctionType<T>
//   ) => React.JSX.Element
// ) => React.JSX.Element;

// export const toCreateComponentWrapper =
//   <T extends TreeNodeComponentDefaultProps>(
//     createTreeNodeComponentFunction: CreateTreeNodeComponentFunctionType<T>
//   ): CreateComponentWrapperType =>
//   callback =>
//     callback(createTreeNodeComponentFunction);

// export type TreeNodeComponentMapType = Map<UniqueKey, CreateComponentWrapperType>;
