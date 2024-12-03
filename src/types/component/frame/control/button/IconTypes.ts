import {
  IControlAttr,
  IControlEvent,
  ICustomControlProps,
} from 'types/component/frame/control/ControlTypes';

/**
 * IconComponent의 props를 정의한 interface 입니다.
 */
export interface IIconProps extends ICustomControlProps<IIconCustomAttr, IControlEvent> {}

/**
 * IconComponent의 custom attribute를 정의한 interface 입니다.
 */
interface IIconCustomAttr extends IControlAttr {
  width?: string;
  height?: string;
}
