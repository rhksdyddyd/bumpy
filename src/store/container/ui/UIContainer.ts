import { boundMethod } from 'autobind-decorator';
import ControlHandlerContainer from 'store/container/ui/controlhandler/ControlHandlerContainer';

/**
 * ui 관련 정보를 담는 container 입니다.
 * dropdown의 depth, recently accessed control, tooltip 등의 정보를 관리하게 될 예정입니다.
 */
export default class UIContainer {
  /**
   * ControlInfo를 해석하여 추가 정보를 구성하는 ControlHandler를 관리합니다.
   */
  private controlHandlerContainer: ControlHandlerContainer;

  /**
   * 생성자
   */
  public constructor() {
    this.controlHandlerContainer = new ControlHandlerContainer();
  }

  /**
   * ControlhandlerContainer를 반환합니다.
   *
   * @returns ControlhandlerContainer
   */
  @boundMethod
  public getControlHandlerContainer(): ControlHandlerContainer {
    return this.controlHandlerContainer;
  }
}
