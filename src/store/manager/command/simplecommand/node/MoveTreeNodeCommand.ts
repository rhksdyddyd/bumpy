import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import SimpleCommand from '../SimpleCommand';

export default class MoveTreeNodeCommand extends SimpleCommand {
  private target: TreeNode;

  private oldParent?: TreeNode;

  private oldNextSibling?: TreeNode;

  private newParent: TreeNode;

  private newNextSibling?: TreeNode;

  public constructor(target: TreeNode, newParent: TreeNode, newNextSibling?: TreeNode) {
    super();
    this.target = target;
    this.newParent = newParent;
    this.newNextSibling = newNextSibling;
  }

  @boundMethod
  public apply(): void {
    this.oldParent = this.target.getParent();
    this.oldNextSibling = this.target.getNextSibling();

    if (this.oldParent !== undefined) {
      this.target.remove(this.oldParent);
    }

    this.target.append(this.newParent, this.newNextSibling);
  }

  @boundMethod
  public unapply(): void {
    this.target.remove(this.newParent);

    if (this.oldParent !== undefined) {
      this.target.append(this.oldParent, this.oldNextSibling);
    }
  }

  @boundMethod
  public reapply(): void {
    if (this.oldParent !== undefined) {
      this.target.remove(this.oldParent);
    }

    this.target.append(this.newParent, this.newNextSibling);
  }
}
