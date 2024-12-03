import { boundMethod } from 'autobind-decorator';
import CommandCompositor from 'store/manager/command/CommandCompositor';

/**
 * Command 들을 stack 형태로 보관하는 class 입니다.
 * undoable 한 commandCompositor 들을 실행 후 undo stack 에 보관합니다.
 * Stack 의 이름이나, 실제로는 deque 형태로 동작합니다.
 * Command 가 계속 push 되어 stack size 를 넘어가면 FIFO 형태로 commandCompositor를 제거합니다.
 */
export default class UndoStack {
  /**
   * Undo stack 입니다. 실행을 마친 commandCompositor 를 보관합니다.
   */
  private undoStack: CommandCompositor[];

  /**
   * Undo 된 command 를 보관하는 redo stack 입니다. Command execute 시 clear 됩니다.
   */
  private redoStack: CommandCompositor[];

  /**
   * Undo stack 의 max size 를 의미합니다.
   */
  private readonly size: number;

  /**
   * 생성자
   *
   * @param size undoStack의 크기
   */
  public constructor(size = 20) {
    this.undoStack = [];
    this.redoStack = [];
    this.size = size;
  }

  /**
   * Undo 가 가능한 상태인지 확인합니다.
   *
   * @returns Undo stack 에 command 가 있는 경우 true
   */
  @boundMethod
  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Redo 가 가능한 상태인지 확인합니다.
   *
   * @returns Redo stack 에 command 가 있는 경우 true
   */
  @boundMethod
  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * 샐항을 마친 commandCompositor 를 undo stack 에 추가합니다.
   * Redo stack 을 clear 하며, undo stack size 가 넘어가는 경우 FIFO 형태로 제거합니다..
   *
   * @param commandCompositor 실행을 마친 commandCompositor
   */
  @boundMethod
  public push(commandCompositor: CommandCompositor): void {
    this.redoStack = [];
    this.undoStack.push(commandCompositor);
    if (this.undoStack.length > this.size) {
      this.undoStack.shift();
    }
  }

  /**
   * Undo 해야 할 CommandCompositor 를 redo stack 으로 옮기고 반환합니다.
   *
   * @returns Undo 해야 할 CommandCompositor, undo stack 이 비어있다면 undefined
   */
  @boundMethod
  public prev(): Nullable<CommandCompositor> {
    const command = this.undoStack.pop();
    if (command === undefined) {
      return undefined;
    }
    this.redoStack.push(command);
    return command;
  }

  /**
   * Redo 해야 할 CommandCompositor 를 undo stack 으로 옯기고 반환 합니다.
   *
   * @returns Redo 해야 할 CommandCompositor, redo stack 이 비어있다면 undefined
   */
  @boundMethod
  public next(): Nullable<CommandCompositor> {
    const command = this.redoStack.pop();
    if (command === undefined) {
      return undefined;
    }
    this.undoStack.push(command);
    return command;
  }
}
