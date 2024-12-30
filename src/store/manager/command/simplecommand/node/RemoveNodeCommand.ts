import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import SimpleCommand from '../SimpleCommand';

class RemoveTreeNodeCommand extends SimpleCommand {
  private target: TreeNode;

  private parent: Nullable<TreeNode>;

  private nextSibling: Nullable<TreeNode>;

  public constructor(target: TreeNode) {
    super();
    this.target = target;
    this.parent = target.getParent();
    this.nextSibling = target.getNextSibling();
  }

  @boundMethod
  public apply(): void {
    if (this.parent !== undefined) {
      this.target.remove(this.parent);
    }
  }

  @boundMethod
  public unapply(): void {
    if (this.parent !== undefined) {
      this.target.append(this.parent, this.nextSibling);
    }
  }

  @boundMethod
  public reapply(): void {
    this.apply();
  }
}

export default RemoveTreeNodeCommand;
