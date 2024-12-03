import {
  IControlAttr,
  IControlEvent,
  ICustomControlProps,
} from 'types/component/frame/control/ControlTypes';

/**
 * ArrowButtonComponent의 props를 정의한 interface 입니다.
 */
export interface IArrowButtonProps extends ICustomControlProps<IArrowButtonAttr, IControlEvent> {}

/**
 * ArrowButtonComponent의 attribute를 정의한 interface 입니다.
 */
interface IArrowButtonAttr extends IControlAttr {
  arrowType?: string;
  width?: string;
  height?: string;
}
