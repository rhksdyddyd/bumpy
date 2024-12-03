import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import React from 'react';
import BaseEvent from 'store/manager/event/wrapper/BaseEvent';

/**
 * EventHandler 에서 사용하는 mouse event type 입니다.
 * React event 의 wrapper 입니다.
 */
export default class MouseEvent extends BaseEvent {
  /**
   * 실제로 발생 한 react mouse event
   */
  private readonly event: React.MouseEvent<HTMLElement | SVGElement>;

  /**
   * 생성자
   *
   * @param event react mouse event 입니다.
   * @param targetModel event가 발생한 TreeNode
   */
  public constructor(
    event: React.MouseEvent<HTMLElement | SVGElement>,
    eventTargetModel: TreeNode
  ) {
    super(eventTargetModel);
    this.event = event;
  }

  /**
   * event의 screenX 좌표를 반환합니다.
   *
   * @returns event.screenX
   */
  @boundMethod
  public getScreenX(): number {
    return this.event.screenX;
  }

  /**
   * event의 screenY 좌표를 반환합니다.
   *
   * @returns event.screenY
   */
  @boundMethod
  public getScreenY(): number {
    return this.event.screenY;
  }

  /**
   * event의 clientX 좌표를 반환합니다.
   *
   * @returns event.clientX
   */
  @boundMethod
  public getClientX(): number {
    return this.event.clientX;
  }

  /**
   * event의 clientY 좌표를 반환합니다.
   *
   * @returns event.clientY
   */
  @boundMethod
  public getClientY(): number {
    return this.event.clientY;
  }

  /**
   * mouse 왼쪽 버튼이 눌려있는지 반환합니다.
   *
   * @returns mouse 왼쪽 버튼이 눌려있는 경우 true
   */
  @boundMethod
  public isLButton(): boolean {
    return this.event.button === 0;
  }

  /**
   * mouse 오른쪽 버튼이 눌려있는지 반환합니다.
   *
   * @returns mouse 오른쪽 버튼이 눌려있는 경우 true
   */
  @boundMethod
  public isRButton(): boolean {
    return this.event.button === 2;
  }

  /**
   * Mac 에서는 option, 나머지 플랫폼에서는 alt 를 나타내른는 alt key 가 눌린 상태인지 확인합니다.
   *
   * @returns alt key 가 눌린 경우 true
   */
  @boundMethod
  public isAltDown(): boolean {
    return this.event.altKey;
  }

  /**
   * Mac 에서는 control, 나머지 플랫폼에서는 ctrl 을 나타내는 ctrl key 가 눌린 상태인지 확인합니다.
   *
   * @returns ctrl key 가 눌린 경우 true
   */
  @boundMethod
  public isCtrlDown(): boolean {
    return this.event.ctrlKey;
  }

  /**
   * shift 키가 눌려있는 상태인지 확인합니다.
   *
   * @returns shift 키가 눌려있는 경우 true
   */
  @boundMethod
  public isShiftDown(): boolean {
    return this.event.shiftKey;
  }

  /**
   * Mac 에서는 command, Windows 에서는 windows 키를 나타내는 meta key 가 눌린 상태인지 확인합니다.
   * @returns meta key 가 눌린 경우 true
   */
  @boundMethod
  public isMetaDown(): boolean {
    return this.event.metaKey;
  }

  /**
   * react event를 반환합니다.
   *
   * @returns this.event
   */
  @boundMethod
  public getEvent(): React.MouseEvent<HTMLElement | SVGElement> {
    return this.event;
  }
}
