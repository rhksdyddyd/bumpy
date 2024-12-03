import {
  IControlAttr,
  IControlEvent,
  ICustomControlProps,
} from 'types/component/frame/control/ControlTypes';
import { IDropdownMenuInfo } from './menu/DropdownMenuTypes';

/**
 * DropdownComponent의 custom props를 정의한 interface 입니다.
 */
export interface IDropdownProps extends ICustomControlProps<IDropdownAttr, IControlEvent> {}

/**
 * DropdownComponent의 custom attribute를 정의 한 interface 입니다.
 */
export interface IDropdownAttr extends IControlAttr {
  dropdownMenuInfo?: IDropdownMenuInfo;
}
