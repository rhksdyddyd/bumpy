import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import React from 'react';

/**
 * EventHandler 에서 처리할 Event type 의 base class 입니다.
 * React 와의 의존성을 제거하기 위한 class 로, React event 의 wrapper 역할을 합니다.
 * 모든 event class 는 BaseEvent 를 상속하여 구현합니다.
 * 대부분의 메소드가 HTML 동작과 동일합니다.
 * HTML 동작 관련 [문서](https://www.w3schools.com/jsref/dom_obj_event.asp) 를 참고하세요.
 */
export default abstract class BaseEvent {
  /**
   * Event를 발생시킨 target
   */
  private readonly eventTargetModel: TreeNode;

  /**
   * 생성자
   *
   * @param eventTargetModel event가 발생 한 TreeNode 입니다.
   */
  public constructor(eventTargetModel: TreeNode) {
    this.eventTargetModel = eventTargetModel;
  }

  /**
   * event로 인하여 발생하는 기본 동작을 중지합니다.
   */
  @boundMethod
  public preventDefault(): void {
    this.getEvent().preventDefault();
  }

  /**
   * event의 전파를 중지합니다.
   */
  @boundMethod
  public stopPropagation(): void {
    this.getEvent().stopPropagation();
  }

  /**
   * event의 html target을 반환합니다.
   *
   * @returns event의 html target
   */
  @boundMethod
  public getTarget(): EventTarget {
    return this.getEvent().target;
  }

  /**
   * event의 현재 target을 반환합니다.
   *
   * @returns event의 현재 target
   */
  @boundMethod
  public getCurrentTarget(): EventTarget {
    return this.getEvent().currentTarget;
  }

  /**
   * native event를 반환합니다.
   *
   * @returns native event
   */
  @boundMethod
  public getNativeEvent(): Event {
    return this.getEvent().nativeEvent;
  }

  /**
   * event 가 발생한 TreeNode를 반환합니다.
   *
   * @returns event 가 발생한 TreeNode
   */
  @boundMethod
  public getEventTargetModel(): TreeNode {
    return this.eventTargetModel;
  }

  /**
   * event instance를 반환합니다.
   * BaseEvent 의 메소드를 구현하기 위하여 사용합니다.
   * event instance는 각 상속 구현 한 class 에서 관리합니다.
   *
   * @returns React event
   */
  protected abstract getEvent(): React.SyntheticEvent<HTMLElement | SVGElement>;
}
