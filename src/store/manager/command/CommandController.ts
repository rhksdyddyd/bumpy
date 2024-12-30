import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import CommandCompositor from 'store/manager/command/CommandCompositor';
import SimpleCommand from 'store/manager/command/simplecommand/SimpleCommand';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import { EventStateEnum } from 'types/store/event/EventStateEnum';

/**
 * CommandCompositor 의 interface를 조작하는 class 입니다.
 */
export default class CommandController {
  /**
   * 실제 simpleCommand를 관리하는 class 입니다.
   */
  protected commandCompositor: CommandCompositor;

  /**
   * 생성자
   *
   * @param commandCompositor 실제 simple command list를 관리하는 Command Compositor 클래스입니다.
   */
  constructor(commandCompositor: CommandCompositor) {
    this.commandCompositor = commandCompositor;
  }

  /**
   * commandCompositor의 Undoable 속성을 결정합니다. 기본 값은 true 입니다.
   *
   * @param undoable Undo 가능 여부
   */
  @boundMethod
  public setUndoable(undoable: boolean): void {
    this.commandCompositor.setUndoable(undoable);
  }

  /**
   * commandCompositor가 Undo 가능한지 반환합니다.
   * Command 수행 후 true 인 경우 undo stack 에 들어가고, false 인 경우 소멸됩니다.
   *
   * @returns Undoable 여부
   */
  @boundMethod
  public isUndoable(): boolean {
    return this.commandCompositor.isUndoable();
  }

  /**
   * command 수행 이전의 event state를 반환합니다.
   *
   * @returns command 수행 이전의 eventState
   */
  @boundMethod
  public getOldEventState(): EventStateEnum {
    return this.commandCompositor.getOldEventState();
  }

  /**
   * command 수행 이전의 event state를 설정합니다.
   *
   * @param eventState command 수행 이전의 eventState
   */
  @boundMethod
  public setOldEventState(eventState: EventStateEnum): void {
    this.commandCompositor.setOldEventState(eventState);
  }

  /**
   * command 수행 이후의 eventState를 반환합니다.
   *
   * @returns command 수행 이후의 eventState
   */
  @boundMethod
  public getNewEventState(): EventStateEnum {
    return this.commandCompositor.getNewEventState();
  }

  /**
   * command 수행 이후의 eventState를 설정합니다.
   *
   * @param eventState command 수행 이후의 eventState
   */
  @boundMethod
  public setNewEventState(eventState: EventStateEnum): void {
    this.commandCompositor.setNewEventState(eventState);
  }

  /**
   * Commands 수행 이전의 selection container를 반환 합니다.
   *
   * @returns Commands 수행 이전의 selection container
   */
  @boundMethod
  public getOldSelectionContainer(): SelectionContainer {
    return this.commandCompositor.getOldSelectionContainer();
  }

  /**
   * Commands 수행 이전의 selection container를 설정 합니다.
   *
   * @param selectionContainer Commands 수행 이전의 selection container
   */
  @boundMethod
  public setOldSelectionContainer(selectioncontainer: SelectionContainer): void {
    this.commandCompositor.setOldSelectionContainer(selectioncontainer);
  }

  /**
   * Commands 수행 이후의 selection container를 반환 합니다.
   *
   * @returns Commands 수행 이후의 selection container
   */
  @boundMethod
  public getNewSelectionContainer(): SelectionContainer {
    return this.commandCompositor.getNewSelectionContainer();
  }

  /**
   * Commands 수행 이후의 selection container를 설정 합니다.
   *
   * @param selectionContainer Commands 수행 이후의 selection container
   */
  @boundMethod
  public setNewSelectionContainer(selectioncontainer: SelectionContainer): void {
    this.commandCompositor.setNewSelectionContainer(selectioncontainer);
  }

  /**
   * Simple command 가 있는지 확인합니다.
   *
   * @returns SimpleCommand가 있는지의 여부(하나도 없으면 true)
   */
  @boundMethod
  public isEmpty(): boolean {
    return this.commandCompositor.isEmpty();
  }

  /**
   * Simple command 를 추가합니다.
   * 추가한 순서대로 do/redo 동작이 수행되고, 역순으로 undo 동작이 수행됩니다.
   *
   * @param simpleCommand Command 에 추가할 simple command
   */
  @boundMethod
  public appendSimpleCommand(simpleCommand: SimpleCommand): void {
    this.commandCompositor.appendSimpleCommand(simpleCommand);
  }

  /**
   * 후처리 될 simple command 를 추가합니다.
   * 추가한 순서대로 simple command 가 동작됩니다.
   *
   * @param simpleCommand Command 에 추가할 후처리 simple command
   */
  @boundMethod
  public appendPostSimpleCommand(simpleCommand: SimpleCommand): void {
    this.commandCompositor.appendPostSimpleCommand(simpleCommand);
  }

  /**
   * CommandCompositor 의 구성이 완료되기 전 Command내부의 SimpleCommand를 실행합니다.
   */
  @boundMethod
  public preExecuteCommand(): void {
    this.commandCompositor.applySimpleCommand();
  }

  /**
   * CommandCompositor 를 실행 합니다.
   */
  @boundMethod
  public executeCommand(): void {
    this.commandCompositor.applySimpleCommand();
  }

  /**
   * post command 를 실행 합니다.
   */
  @boundMethod
  public executePostCommand(): void {
    this.commandCompositor.applyPostSimpleCommand();
  }

  /**
   * command 수행의 마무리 작업입니다.
   * AppContext의 undo stack에 반영하고,
   * commandProps 의 eventState, SelectionContainer 정보를 commandCompositor에 설정합니다.
   *
   * @param ctx app의 현재 상태가 담겨있는 AppContext
   */
  @boundMethod
  public finishApplyProcess(ctx: AppContext): void {
    if (this.commandCompositor.isUndoable() === true && this.isEmpty() === false) {
      const editableContext = ctx.getEditableContext();
      editableContext.getUndoStack().push(this.commandCompositor);
      const commandProps = editableContext.getCommandProps();
      if (commandProps !== undefined) {
        if (commandProps.newEventState !== undefined) {
          this.commandCompositor.setNewEventState(commandProps.newEventState);
        }
        if (commandProps.newSelectionContainer !== undefined) {
          this.commandCompositor.setNewSelectionContainer(commandProps.newSelectionContainer);
        }
      } else {
        throw Error;
      }
    }
  }

  /**
   * Context 에 있는 undo stack을 이용하여 undo 를 진행합니다.
   *
   * @param ctx app의 현재 상태가 담겨있는 AppContext
   * @returns undo가 수행되었는지의 여부
   */
  @boundMethod
  public unExecuteCommand(ctx: AppContext): boolean {
    const editableContext = ctx.getEditableContext();
    const undoStack = editableContext.getUndoStack();

    if (undoStack.canUndo() === false) {
      return false;
    }
    const commandCompositor = undoStack.prev();
    if (commandCompositor === undefined) {
      return false;
    }

    this.commandCompositor = commandCompositor;
    this.commandCompositor.unapply();

    const commandProps = editableContext.getCommandProps();
    if (commandProps !== undefined) {
      editableContext.setCommandProps({
        ...commandProps,
        newEventState: this.commandCompositor.getOldEventState(),
        newSelectionContainer: this.commandCompositor.getOldSelectionContainer(),
      });
    } else {
      throw Error;
    }

    return true;
  }

  /**
   * Context 에 있는 undo stack을 이용하여 redo 를 진행합니다.
   *
   * @param ctx app의 현재 상태가 담겨있는 AppContext
   * @returns redo가 수행되었는지의 여부
   */
  @boundMethod
  public reExecuteCommand(ctx: AppContext): boolean {
    const editableContext = ctx.getEditableContext();
    const undoStack = editableContext.getUndoStack();

    if (undoStack.canRedo() === false) {
      return false;
    }
    const commandCompositor = undoStack.next();
    if (!commandCompositor) {
      return false;
    }

    this.commandCompositor = commandCompositor;
    this.commandCompositor.reapply();

    const commandProps = editableContext.getCommandProps();
    if (commandProps !== undefined) {
      editableContext.setCommandProps({
        ...commandProps,
        newEventState: this.commandCompositor.getNewEventState(),
        newSelectionContainer: this.commandCompositor.getNewSelectionContainer(),
      });
    } else {
      throw Error;
    }
    return true;
  }

  /**
   * command 수행이 도중에 불가능하다고 판단 될 경우 기존 실행 된 simple command를 되돌립니다.
   */
  @boundMethod
  public fallback(): void {
    this.commandCompositor.fallback();
  }
}
