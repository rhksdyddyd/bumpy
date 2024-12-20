import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import EventMapper from 'store/manager/event/EventMapper';
import KeyEvent from 'store/manager/event/wrapper/KeyEvent';
import MouseEvent from 'store/manager/event/wrapper/MouseEvent';
import WheelEvent from 'store/manager/event/wrapper/WheelEvent';

/**
 * event를 처리하는 manager입니다
 * 각 event 별로 처리하는 함수를 가지고 있습니다.
 * 각 함수 내부에서는 event와 state에 맞는 event handler를 가져와서 실행합니다.
 */
export default class EventManager {
  /**
   * state 에 따른 event handler list 를 보관하는 자료구조 입니다.
   */
  private readonly eventMap: EventMapper;

  /**
   * 생성자
   */
  public constructor() {
    this.eventMap = new EventMapper();
  }

  /**
   * MouseDown event를 해석합니다.
   *
   * @param event mouse event
   * @param ctx 현재 app의 정보를 담고 있는 AppContext
   */
  @boundMethod
  public onMouseDown(event: MouseEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onMouseDown(event, ctx));
  }

  /**
   * MouseUp event를 해석합니다.
   *
   * @param event mouse event
   * @param ctx 현재 app의 정보를 담고 있는 AppContext
   */
  @boundMethod
  public onMouseUp(event: MouseEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onMouseUp(event, ctx));
  }

  /**
   * MouseMove event를 해석합니다.
   *
   * @param event mouse event
   * @param ctx 현재 app의 정보를 담고 있는 AppContext
   */
  @boundMethod
  public onMouseMove(event: MouseEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onMouseMove(event, ctx));
  }

  /**
   * MouseDrag event를 해석합니다.
   *
   * @param event mouse event
   * @param ctx 현재 app의 정보를 담고 있는 AppContext
   */
  @boundMethod
  public onDrag(event: MouseEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onDrag(event, ctx));
  }

  /**
   * MouseWheel event를 해석합니다.
   *
   * @param event wheel event
   * @param ctx 현재 app의 정보를 담고 있는 AppContext
   */
  @boundMethod
  public onWheel(event: WheelEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onWheel(event, ctx));
  }

  /**
   * KeyDown event를 해석합니다.
   *
   * @param event key event
   * @param ctx 현재 app의 정보를 담고 있는 AppContext
   */
  @boundMethod
  public onKeyDown(event: KeyEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onKeyDown(event, ctx));
  }

  /**
   * KeyUp event를 해석합니다.
   *
   * @param event key event
   * @param ctx 현재 app의 정보를 담고 있는 AppContext
   */
  @boundMethod
  public onKeyUp(event: KeyEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onKeyUp(event, ctx));
  }

  @boundMethod
  public onAppAreaMouseDown(event: MouseEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onAppAreaMouseDown(event, ctx));
  }

  @boundMethod
  public onAppAreaMouseUp(event: MouseEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onAppAreaMouseUp(event, ctx));
  }

  @boundMethod
  public onAppAreaMouseMove(event: MouseEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onAppAreaMouseMove(event, ctx));
  }

  @boundMethod
  public onAppAreaDrag(event: MouseEvent, ctx: AppContext): void {
    this.eventMap
      .get(ctx.getEditableContext().getEventState())
      ?.some(handler => handler.onAppAreaDrag(event, ctx));
  }
}
