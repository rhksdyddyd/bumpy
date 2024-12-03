import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import React from 'react';
import MouseEvent from 'store/manager/event/wrapper/MouseEvent';

/**
 * EventHandler 에서 사용하는 wheel event type 입니다. Mouse event 를 상속받습니다.
 * React event 의 wrapper 입니다.
 * Mac 에서 shift + wheel 하면 가로 스크롤이 됩니다.
 */
export default class WheelEvent extends MouseEvent {
  /**
   * 생성자
   *
   * @param event react wheel event 입니다.
   * @param targetModel event가 발생한 TreeNode
   */
  // eslint-disable-next-line no-useless-constructor
  public constructor(event: React.WheelEvent<HTMLElement>, eventTargetModel: TreeNode) {
    super(event, eventTargetModel);
  }

  /**
   * xoffset을 반환합니다.
   *
   * @returns wheel event의 deltaX
   */
  @boundMethod
  public getXOffset(): number {
    return (this.getEvent() as React.WheelEvent<HTMLElement>).deltaX;
  }

  /**
   * yoffset을 반환합니다.
   *
   * @returns wheel event의 deltaY
   */
  @boundMethod
  public getYOffset(): number {
    return (this.getEvent() as React.WheelEvent<HTMLElement>).deltaY;
  }
}
