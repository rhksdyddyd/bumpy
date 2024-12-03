import AppStore from 'store/AppStore';
import {
  IControlAttr,
  IControlEvent,
  IControlInfo,
  IControlProps,
  ICustomControlProps,
} from 'types/component/frame/control/ControlTypes';
import { CommandEnum } from 'types/store/command/CommandEnum';

/**
 * ControlHandler의 type입니다.
 */
type ControlHandlerType = (
  commandId: CommandEnum,
  appStore: AppStore,
  attr: IControlAttr,
  controlInfo?: IControlInfo[]
) => IControlProps | ICustomControlProps<IControlAttr, IControlEvent>;

/**
 * ControlHandler를 관리하는 map의 type입니다.
 */
export type ControlHandlerMapType = Map<CommandEnum, ControlHandlerType>;

/**
 * WithControlHandlerComponent의 props를 정의한 interface 입니다.
 */
export interface IWithControlHandlerComponentProps {
  controlInfo: IControlInfo;
}
