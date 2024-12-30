import { boundMethod } from 'autobind-decorator';
import SimpleCommand from '../../SimpleCommand';

class SetGraphicAttributeCommand<M, V> extends SimpleCommand {
  private targetModel: M;

  private oldValue: V;

  private newValue: V;

  private setterFunction: (value: V) => void;

  public constructor(targetModel: M, oldValue: V, newValue: V, setterFunction: (prop: V) => void) {
    super();
    this.targetModel = targetModel;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.setterFunction = setterFunction;
  }

  @boundMethod
  public apply(): void {
    this.setterFunction(this.newValue);
  }

  @boundMethod
  public unapply(): void {
    this.setterFunction(this.oldValue);
  }

  @boundMethod
  public override reapply(): void {
    this.apply();
  }
}

export default SetGraphicAttributeCommand;
