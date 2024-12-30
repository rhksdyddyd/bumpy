import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import AppContext from 'store/context/AppContext';
import SimpleCommand from '../SimpleCommand';

class RequestRerenderTreeNodeComponentCommand extends SimpleCommand {
  private ctx: AppContext;

  private targetModel: TreeNode;

  private onApply: boolean;

  private onUnapply: boolean;

  public constructor(ctx: AppContext, targetModel: TreeNode, onApply: boolean, onUnapply: boolean) {
    super();
    this.ctx = ctx;
    this.targetModel = targetModel;
    this.onApply = onApply;
    this.onUnapply = onUnapply;
  }

  @boundMethod
  public apply(): void {
    if (this.onApply === true) {
      this.targetModel.requestRerender(this.ctx);
    }
  }

  @boundMethod
  public unapply(): void {
    if (this.onUnapply === true) {
      this.targetModel.requestRerender(this.ctx);
    }
  }

  @boundMethod
  public override reapply(): void {
    this.apply();
  }
}

export default RequestRerenderTreeNodeComponentCommand;
