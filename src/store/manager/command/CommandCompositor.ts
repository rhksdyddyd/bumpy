import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import SimpleCommand from 'store/manager/command/simplecommand/SimpleCommand';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import { EventStateEnum } from 'types/store/event/EventStateEnum';

/**
 * 하나의 작업 단위를 나타내는 class 입니다.
 * 여러 simple command 를 list 로 가지고 있으며 do/undo/redo 의 단위가 됩니다.
 * 실제 동작 시 CommandController가 interface 역할을 하게 됩니다.
 * Undo stack 이 이 class 의 life cycle 을 담당합니다.
 */
export default class CommandCompositor {
  /**
   * 실제 동작 정보를 담고있는 simpleCommand 들의 list 입니다.
   */
  protected simpleCommandList: SimpleCommand[];

  /**
   * 현재 실행할 수 있는 simpleCommand의 index입니다.
   * 실제 simpleCommand를 실행 할 때에는 simpleCommandList의 length와 비교를 하고 해야 합니다.
   * simpleCommandList가 비어있을 때: 0
   * simpleCommandList에 simpleCommand가 1개 있고 아무 수행을 하지 않았을 때: 0
   * simpleCommandList에 simpleCommand가 3개 있고 1개만 수행하였을 때: 1
   */
  private executalbeSimpleCommandIndex: number;

  /**
   * simple command 들의 list 로, 후처리로 진행되어야 하는 simple command 들입니다.
   * Do, undo, redo 시 commandList 의 작업이 마쳐진 뒤 postCommandList 의 작업을 수행합니다.
   */
  protected postSimpleCommandList: SimpleCommand[];

  /**
   * Undo 가 가능한 command 인지를 나타냅니다.
   * undoable === false 인 경우, undo stack 에 들어가지 않고 사라집니다.
   * 기본 값은 true 입니다.
   */
  private undoable: boolean;

  /**
   * Undo 시의 EventState 정보입니다.
   */
  private oldEventState: EventStateEnum;

  /**
   * do, Redo 시의 EventState 정보입니다.
   */
  private newEventState: EventStateEnum;

  /**
   * Undo 시의 Selection 정보입니다.
   */
  private oldSelectionContainer: SelectionContainer;

  /**
   * do, Redo 시의 Selection 정보입니다.
   */
  private newSelectionContainer: SelectionContainer;

  /**
   * 생성자
   *
   * @param ctx 현재 app의 상태를 담고 있는 context입니다.
   */
  public constructor(ctx: AppContext) {
    const editableContext = ctx.getEditableContext();

    this.simpleCommandList = [];
    this.executalbeSimpleCommandIndex = 0;
    this.postSimpleCommandList = [];
    this.undoable = true;
    this.oldEventState = editableContext.getEventState();
    this.newEventState = editableContext.getEventState();
    this.oldSelectionContainer = editableContext.getSelectionContainer().clone();
    this.newSelectionContainer = editableContext.getSelectionContainer().clone();
  }

  /**
   * Undoable 속성을 결정합니다. 기본 값은 true 입니다.
   *
   * @param undoable Undo 가능 여부
   */
  @boundMethod
  public setUndoable(undoable: boolean): void {
    this.undoable = undoable;
  }

  /**
   * Undo 가능한 command 인지 확인합니다.
   * Command 수행 후 true 인 경우 undo stack 에 들어가고, false 인 경우 소멸됩니다.
   *
   * @returns Undoable 여부
   */
  @boundMethod
  public isUndoable(): boolean {
    return this.undoable;
  }

  /**
   * command 수행 이전의 event state를 반환합니다.
   *
   * @returns command 수행 이전의 eventState
   */
  @boundMethod
  public getOldEventState(): EventStateEnum {
    return this.oldEventState;
  }

  /**
   * command 수행 이전의 event state를 설정합니다.
   *
   * @param eventState command 수행 이전의 eventState
   */
  @boundMethod
  public setOldEventState(eventState: EventStateEnum): void {
    this.oldEventState = eventState;
  }

  /**
   * command 수행 이후의 eventState를 반환합니다.
   *
   * @returns command 수행 이후의 eventState
   */
  @boundMethod
  public getNewEventState(): EventStateEnum {
    return this.newEventState;
  }

  /**
   * command 수행 이후의 eventState를 설정합니다.
   *
   * @param eventState command 수행 이후의 eventState
   */
  @boundMethod
  public setNewEventState(eventState: EventStateEnum): void {
    this.newEventState = eventState;
  }

  /**
   * Commands 수행 이전의 selection container를 반환 합니다.
   *
   * @returns Commands 수행 이전의 selection container
   */
  @boundMethod
  public getOldSelectionContainer(): SelectionContainer {
    return this.oldSelectionContainer;
  }

  /**
   * Commands 수행 이전의 selection container를 설정 합니다.
   *
   * @param selectionContainer Commands 수행 이전의 selection container
   */
  public setOldSelectionContainer(selectionContainer: SelectionContainer): void {
    this.oldSelectionContainer = selectionContainer;
  }

  /**
   * Commands 수행 이후의 selection container를 반환 합니다.
   *
   * @returns Commands 수행 이후의 selection container
   */
  @boundMethod
  public getNewSelectionContainer(): SelectionContainer {
    return this.newSelectionContainer;
  }

  /**
   * Commands 수행 이후의 selection container를 설정 합니다.
   *
   * @param selectionContainer Commands 수행 이후의 selection container
   */
  public setNewSelectionContainer(selectionContainer: SelectionContainer): void {
    this.newSelectionContainer = selectionContainer;
  }

  /**
   * Simple command 가 있는지 확인합니다.
   *
   * @returns SimpleCommand가 있는지의 여부(하나도 없으면 true)
   */
  @boundMethod
  public isEmpty(): boolean {
    return this.simpleCommandList.length === 0 && this.postSimpleCommandList.length === 0;
  }

  /**
   * Simple command 를 추가합니다.
   * 추가한 순서대로 do/redo 동작이 수행되고, 역순으로 undo 동작이 수행됩니다.
   *
   * @param simpleCommand Command 에 추가할 simple command
   */
  @boundMethod
  public appendSimpleCommand(simpleCommand: SimpleCommand): void {
    this.simpleCommandList.push(simpleCommand);
  }

  /**
   * 후처리 될 simple command 를 추가합니다.
   * 추가한 순서대로 simple command 가 동작됩니다.
   *
   * @param simpleCommand Command 에 추가할 후처리 simple command
   */
  @boundMethod
  public appendPostSimpleCommand(simpleCommand: SimpleCommand): void {
    this.postSimpleCommandList.push(simpleCommand);
  }

  /**
   * 현재 수행할 수 있는 simple command를 실행(apply)합니다.
   */
  @boundMethod
  public applySimpleCommand(): void {
    for (
      let index = this.executalbeSimpleCommandIndex;
      index < this.simpleCommandList.length;
      index += 1
    ) {
      this.simpleCommandList[index].apply();
    }

    this.executalbeSimpleCommandIndex = this.simpleCommandList.length;
  }

  /**
   * Post Command 를 수행합니다.
   */
  @boundMethod
  public applyPostSimpleCommand(): void {
    this.postSimpleCommandList.forEach(simpleCommand => simpleCommand.apply());
  }

  /**
   * Command 의 undo 를 수행합니다.
   */
  @boundMethod
  public unapply(): void {
    this.simpleCommandList.reverse().forEach(command => {
      command.unapply();
    });
    this.postSimpleCommandList.forEach(simpleCommand => simpleCommand.unapply());
  }

  /**
   * Command 의 redo 를 수행합니다.
   */
  @boundMethod
  public reapply(): void {
    this.simpleCommandList.reverse().forEach(command => {
      command.reapply();
    });
    this.postSimpleCommandList.forEach(simpleCommand => simpleCommand.reapply());
  }

  /**
   * 이전 handler command까지 실행되었으나 작업을 취소하는 상황에서 호출합니다.
   * 현재까지 샐행 했던 index 부터 역순으로 0번 index 까지 수행합니다.
   */
  @boundMethod
  public fallback(): void {
    for (let index = this.executalbeSimpleCommandIndex - 1; index >= 0; index -= 1) {
      this.simpleCommandList.at(index)?.unapply();
    }
  }
}
