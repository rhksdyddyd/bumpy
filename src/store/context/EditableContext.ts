import { boundMethod } from 'autobind-decorator';
import SlideModel from 'model/node/slide/SlideModel';
import TreeNode from 'model/node/TreeNode';
import UIContainer from 'store/container/ui/UIContainer';
import CommandController from 'store/manager/command/CommandController';
import UndoStack from 'store/manager/command/UndoStack';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import { ICommandProps } from 'types/store/BasicTypes';
import { CommandModeEnum } from 'types/store/command/CommandModeEnum';
import { IEditableContextInitProp } from 'types/store/context/AppContextTypes';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import IdGenerator from 'util/id/IdGenerator';

/**
 * App을 동작하면서 변경이 될 수 있는 정보들을 관리하는 context입니다.
 */
export default class EditableContext {
  /**
   * app을 구성하는 treeNode 중 root입니다.
   * 생성자에서 임의로 생성합니다.
   */
  private treeNodeRoot: TreeNode;

  /**
   * 현재 event의 상태를 나타냅니다.
   * event manager 에서 처리하는 event handler 구성이 달라집니다.
   */
  private eventState: EventStateEnum;

  /**
   * 현재 mouse의 event 상태를 나타냅니다.
   * true 이면 현재 마우스 left button이 click 된 상태입니다.
   * false이면 click이 해제 된 상태입니다.
   */
  private mouseLButtonPressed: boolean;

  /**
   * Command 를 보관하는 undo stack 입니다.
   */
  private undoStack: UndoStack;

  /**
   * Command를 어떻게 처리할 지 에 대한 Mode(EditMode, ReadMode 등)를 나타냅니다.
   */
  private commandMode: CommandModeEnum;

  /**
   * 현재 event를 처리하기 위하여 필요한 요소들을 나타냅니다.
   * 휘발적이며 event 마다 초기화 됩니다.
   */
  private commandProps: Nullable<ICommandProps>;

  /**
   * 현재 event 에서 실행되어야 할 command 를 보관합니다.
   * 휘발적이며 event 마다 초기화 됩니다.
   */
  private commandController: Nullable<CommandController>;

  /**
   * Model Type별 Selection을 보관합니다.
   * selection 변경 시 NodeSelectionContainer 내부 selection 정보만 변경됩니다.
   */
  private selectionContainer: SelectionContainer;

  /**
   * UI 관련 정보를 보관합니다.
   */
  private readonly uiContainer: UIContainer;

  /*
   * 단축키 관련 정보를 보관합니다.
   */
  // private readonly shortcutContainer: ShortcutContainer;

  /**
   * 현재 Selection을 바탕으로 업데이트 할 정보를 보관합니다.
   */
  // private readonly propContainer: PropContainer;

  /**
   * shape editing과 관련된 정보를 보관합니다.
   */
  // private readonly graphicEditInfoContainer: GraphicEditInfoContainer;

  /**
   * 강제로 rerender를 발생시키기 위해 모아놓은 trigger 함수의 list입니다.
   */
  private rerenderTriggerList: Array<() => void>;

  /**
   * 생성자
   *
   * @param editableContextInitProp EditableContext를 초기화 하기 위한 정보
   */
  constructor(editableContextInitProp: IEditableContextInitProp) {
    this.treeNodeRoot = new SlideModel(IdGenerator.generateId());
    this.eventState = EventStateEnum.IDLE;
    this.mouseLButtonPressed = false;
    this.undoStack = new UndoStack();
    this.commandMode = CommandModeEnum.EDIT;
    this.commandProps = undefined;
    this.commandController = undefined;
    this.selectionContainer = this.createSelectionContainer();
    this.uiContainer = new UIContainer();
    // this.shortCutContainer = new ShortCutContainer();
    // this.propContainer = new PropContainer();
    // this.graphicEditInfoContainer = new GraphicEditInfoContainer();
    this.rerenderTriggerList = [];
  }

  /**
   * treeNode의 root를 반환합니다.
   *
   * @returns treeNodeRoot
   */
  @boundMethod
  public getTreeNodeRoot(): TreeNode {
    return this.treeNodeRoot;
  }

  /**
   * 현재 eventState를 반환합니다.
   *
   * @returns eventState
   */
  @boundMethod
  public getEventState(): EventStateEnum {
    return this.eventState;
  }

  /**
   * 새로운 eventState로 설정합니다.
   *
   * @param eventState 새롭게 설정 할 eventState
   */
  @boundMethod
  public setEventState(eventState: EventStateEnum): void {
    this.eventState = eventState;
  }

  /**
   * undoStack을 반환합니다.
   *
   * @returns undoStack
   */
  @boundMethod
  public getUndoStack(): UndoStack {
    return this.undoStack;
  }

  /**
   * mouse left button이 눌려있는 상태인지 반환합니다.
   *
   * @returns mouseLButtonPressed
   */
  @boundMethod
  public isMouseLButtonPressed(): boolean {
    return this.mouseLButtonPressed;
  }

  /**
   * mouse left button이 눌려있는 상태인지 설정합니다.
   *
   * @param mouseLButtonPressed mouse left button이 눌려있는 상태
   */
  @boundMethod
  public setMouseLButtonPressed(mouseLButtonPressed: boolean): void {
    this.mouseLButtonPressed = mouseLButtonPressed;
  }

  /**
   * commandMode를 반환합니다.
   * CommandHandlerList를 commandMode 별로 다르게 구성 할 수 있습니다.
   *
   * @returns commandMode
   */
  @boundMethod
  public getCommandMode(): CommandModeEnum {
    return this.commandMode;
  }

  /**
   * commandMode를 설정합니다.
   * CommandHandlerList를 commandMode 별로 다르게 구성 할 수 있습니다.
   *
   * @param commandMode 새롭게 설정 할 commandModel
   */
  @boundMethod
  public setCommandMode(commandMode: CommandModeEnum): void {
    this.commandMode = commandMode;
  }

  /**
   * commandProps를 반환합니다.
   *
   * @returns commandProps
   */
  @boundMethod
  public getCommandProps(): Nullable<ICommandProps> {
    return this.commandProps;
  }

  /**
   * commandProps를 새롭게 설정합니다.
   *
   * @param commandProps 새로 설정할 commandProps
   */
  @boundMethod
  public setCommandProps(commandProps: Nullable<ICommandProps>): void {
    this.commandProps = commandProps;
  }

  /**
   * commandController를 반환합니다.
   *
   * @returns commandController
   */
  @boundMethod
  public getCommandController(): CommandController | undefined {
    return this.commandController;
  }

  /**
   * commandController를 설정합니다.
   *
   * @param commandController 새롭게 설정 할 commandController
   */
  @boundMethod
  public setCommandController(commandController: CommandController | undefined): void {
    this.commandController = commandController;
  }

  /**
   * selectionContainer를 반환합니다.
   *
   * @returns selectionContainer
   */
  @boundMethod
  public getSelectionContainer(): SelectionContainer {
    return this.selectionContainer;
  }

  /**
   * selectionContainer를 설정합니다.
   *
   * @param selectionContainer 새롭게 설정 할 selectionContainer
   */
  @boundMethod
  public setSelectionContainer(selectionContainer: SelectionContainer): void {
    this.selectionContainer = selectionContainer;
  }

  /**
   * selectionContainer를 생성합니다.
   *
   * @returns 새롭게 생성 한 selectionContainer
   */
  @boundMethod
  public createSelectionContainer(): SelectionContainer {
    return new SelectionContainer();
  }

  /**
   * UIContainer를 반환합니다.
   *
   * @returns UIContainer
   */
  @boundMethod
  public getUIContainer(): UIContainer {
    return this.uiContainer;
  }

  // @boundMethod
  // public getShortCutContainer(): ShortCutContainer {
  //     return this.shortCutContainer;
  // }

  // @boundMethod
  // public getPropContainer(): PropContainer {
  //     return this.propContainer;
  // }

  // @boundMethod
  // public getGraphicEditInfoContainer(): GraphicEditInfoContainer {
  //     return this.graphicEditInfoContainer;
  // }

  /**
   * component의 rerender를 발생시킬 수 있는 함수를 append 합니다
   *
   * @param rerenderTrigger rerender를 발생시키는 함수
   */
  @boundMethod
  public appendRerenderTrigger(rerenderTrigger: () => void): void {
    this.rerenderTriggerList.push(rerenderTrigger);
  }

  /**
   * 모여있는 rerender trigger 함수를 모두 실행하고, 배열을 비웁니다.
   */
  @boundMethod
  public flushRerenderTriggerList(): void {
    this.rerenderTriggerList.forEach(rerenderTrigger => {
      rerenderTrigger();
    });
    this.rerenderTriggerList = [];
  }
}
