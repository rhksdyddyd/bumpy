import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import SimpleCommand from '../SimpleCommand';

class AppendTreeNodeCommand extends SimpleCommand {
  private target: TreeNode;

  private parent: TreeNode;

  private nextSibling?: TreeNode;

  public constructor(target: TreeNode, parent: TreeNode, nextSibling?: TreeNode) {
    super();
    this.target = target;
    this.parent = parent;
    this.nextSibling = nextSibling;
  }

  @boundMethod
  public apply(): void {
    this.target.append(this.parent, this.nextSibling);
  }

  @boundMethod
  public unapply(): void {
    this.target.remove(this.parent);
  }

  @boundMethod
  public reapply(): void {
    this.apply();
  }
}

export default AppendTreeNodeCommand;
