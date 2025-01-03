import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import CommandManager from 'store/manager/command/CommandManager';
import EventManager from 'store/manager/event/EventManager';
import KeyEvent from 'store/manager/event/wrapper/KeyEvent';
import MouseEvent from 'store/manager/event/wrapper/MouseEvent';
import WheelEvent from 'store/manager/event/wrapper/WheelEvent';
import SelectionManager from 'store/manager/selection/SelectionManager';
import { IManagerExcutionOptions } from 'types/store/AppStoreTypes';
import { ICommandProps } from 'types/store/command/CommandTypes';

/**
 * App의 상태를 관리하는 class 입니다.
 * 상태 정보를 담고있는 AppContext를 가지고 있으며,
 * context를 변경할 수 있는 manager를 가지고 있습니다.
 * event 가 발생하면 AppStore의 event 처리 함수를 호출하여 context를 변경합니다.
 */
export default class AppStore {
  /**
   * app의 전반적인 정보를 담고있는 인스턴스 입니다.
   */
  private readonly ctx: AppContext;

  /**
   * Event handling 을 담당하는 인스턴스 입니다.
   */
  private readonly eventManager: EventManager;

  /**
   * Command handling 을 담당하는 인스턴스 입니다.
   */
  private readonly commandManager: CommandManager;

  /**
   * selection update 를 담당하는 인스턴스 입니다.
   */
  private readonly selectionManager: SelectionManager;

  /**
   * 생성자
   */
  public constructor() {
    this.ctx = new AppContext({
      readOnlyContextInitProp: { handleCommandEventFunction: this.handleCommandEvent },
      editableContextInitProp: {},
    });
    this.commandManager = new CommandManager();
    this.eventManager = new EventManager();
    this.selectionManager = new SelectionManager();
  }

  /**
   * AppContext를 반환합니다.
   *
   * @returns app의 정보를 담고 있는 context
   */
  @boundMethod
  public getAppContext(): AppContext {
    return this.ctx;
  }

  /**
   * Event 시작 전 휘발성이 있는 context 를 초기화 합니다.
   */
  @boundMethod
  private initExecutionProps(commandProps?: ICommandProps): void {
    const editableContext = this.ctx.getEditableContext();
    editableContext.setCommandProps(commandProps);
    editableContext.setCommandController(undefined);
  }

  /**
   * event 처리를 하는 함수입니다..
   * Event -> Command -> Selection 순으로 처리합니다.
   *
   * @param param0.eventType - 실행할 이벤트의 타입
   * @param param0.event - 실행할 이벤트 객체
   * @param param0.commandProps - 명령 실행에 필요한 속성
   */
  @boundMethod
  private executeAllManagers<T extends keyof EventManager>({
    eventType,
    event,
    commandProps,
  }: IManagerExcutionOptions<T>): void {
    this.initExecutionProps(commandProps);

    if (eventType && event) {
      const eventHandler = this.eventManager[eventType] as (
        event: Parameters<EventManager[T]>[0],
        ctx: AppContext
      ) => void;
      if (typeof eventHandler === 'function') {
        eventHandler(event as Parameters<EventManager[T]>[0], this.ctx);
      }
    }

    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);

    this.getAppContext().getEditableContext().flushRerenderTriggerList();
  }

  /**
   * event의 해석 없이 command의 실행을 하는 함수입니다.
   *
   * @param commandProps 실행 할 command의 정보를 담은 prop
   */
  @boundMethod
  public handleCommandEvent(commandProps: ICommandProps): void {
    this.executeAllManagers({ commandProps });
  }

  /**
   * MouseDown event를 처리하는 함수입니다.
   *
   * @param event MouseEvent
   */
  @boundMethod
  public handleMouseDown(event: MouseEvent): void {
    this.executeAllManagers({ event, eventType: 'onMouseDown' });
  }

  /**
   * MouseUp event를 처리하는 함수입니다.
   *
   * @param event MouseEvent
   */
  @boundMethod
  public handleMouseUp(event: MouseEvent): void {
    this.executeAllManagers({ event, eventType: 'onMouseUp' });
  }

  /**
   * MouseMove event를 처리하는 함수입니다.
   *
   * @param event MouseEvent
   */
  @boundMethod
  public handleMouseMove(event: MouseEvent): void {
    this.executeAllManagers({ event, eventType: 'onMouseMove' });
  }

  /**
   * MouseDrag event를 처리하는 함수입니다.
   *
   * @param event MouseEvent
   */
  @boundMethod
  public handleDrag(event: MouseEvent): void {
    this.executeAllManagers({ event, eventType: 'onDrag' });
  }

  /**
   * MouseWheel event를 처리하는 함수입니다.
   *
   * @param event WheelEvent
   */
  @boundMethod
  public handleWheel(event: WheelEvent): void {
    this.executeAllManagers({ event, eventType: 'onWheel' });
  }

  /**
   * KeyDown event를 처리하는 함수입니다.
   *
   * @param event KeyEvent
   */
  @boundMethod
  public handleKeyDown(event: KeyEvent): void {
    this.executeAllManagers({ event, eventType: 'onKeyDown' });
  }

  /**
   * KeyUp event를 처리하는 함수입니다.
   *
   * @param event KeyEvent
   */
  @boundMethod
  public handleKeyUp(event: KeyEvent): void {
    this.executeAllManagers({ event, eventType: 'onKeyUp' });
  }

  @boundMethod
  public handleAppAreaMouseDown(event: MouseEvent): void {
    this.executeAllManagers({ event, eventType: 'onAppAreaMouseDown' });
  }

  @boundMethod
  public handleAppAreaMouseUp(event: MouseEvent): void {
    this.executeAllManagers({ event, eventType: 'onAppAreaMouseUp' });
  }

  @boundMethod
  public handleAppAreaMouseMove(event: MouseEvent): void {
    this.executeAllManagers({ event, eventType: 'onAppAreaMouseMove' });
  }

  @boundMethod
  public handleAppAreaDrag(event: MouseEvent): void {
    this.executeAllManagers({ event, eventType: 'onAppAreaDrag' });
  }
}
