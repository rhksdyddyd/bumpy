import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import SimpleCommand from '../SimpleCommand';

export default class RemoveTreeNodeCommand extends SimpleCommand {
  private target: TreeNode;

  private parent: Nullable<TreeNode>;

  private nextSibling: Nullable<TreeNode>;

  public constructor(target: TreeNode) {
    super();
    this.target = target;
    this.parent = undefined;
    this.nextSibling = undefined;
  }

  @boundMethod
  public apply(): void {
    if (this.parent === undefined) {
      this.parent = this.target.getParent();
      this.nextSibling = this.target.getNextSibling();
    }
    this.removeTreeNode();
  }

  @boundMethod
  public unapply(): void {
    if (this.parent !== undefined) {
      this.target.append(this.parent, this.nextSibling);
    }
  }

  @boundMethod
  public reapply(): void {
    this.removeTreeNode();
  }

  @boundMethod
  private removeTreeNode(): void {
    if (this.parent !== undefined) {
      this.target.remove(this.parent);
    }
  }
}
