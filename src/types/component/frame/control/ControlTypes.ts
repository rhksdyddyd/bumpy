import { ReactNode } from 'react';
import { ControlTypeEnum } from 'types/component/frame/control/ControlTypeEnum';
import { ReactKeyEnum } from 'types/resource/ReactKeyEnum';
import { ResourceEnum } from 'types/resource/ResourceEnum';
import { CommandEnum } from 'types/store/command/CommandEnum';
import { ToolTipEnum } from 'types/tooltip/ToolTipEnum';
import { ShapeTypeEnum } from 'types/model/node/graphic/ShapeTypeEnum';
import { ControlSubTypeEnum } from './ControlSubTypeEnum';

/**
 * control의 subtype입니다.
 */
export type ControlSubType = ControlSubTypeEnum | ShapeTypeEnum;

/**
 * ControlComponent의 기본 type 입니다.
 */
export type ControlType = (controlProps: IControlProps) => React.JSX.Element;

/**
 * ControlComponent가 기본으로 받는 props interface 입니다.
 */
export interface IControlProps {
  attr: IControlAttr;
  eventhandler?: IControlEvent;
  children?: ReactNode[];
  subControlInfos?: Array<IControlInfo>;
}

/**
 * Props의 확장이 필요한 경우에 대한 ControlComponent의 props interface 입니다.
 */
export interface ICustomControlProps<T extends IControlAttr, S extends IControlEvent> {
  attr?: T;
  eventhandler?: S;
  children?: ReactNode[];
  subControlInfos?: Array<IControlInfo>;
}

/**
 * ControlComponent의 세부 attribute 정보를 담는 interface 입니다.
 */
export interface IControlAttr {
  reactKey: ReactKeyEnum;
  subType?: ControlSubType;
  className?: string;
  label?: ResourceEnum;
  img?: ResourceEnum;
  disabled?: boolean;
  commandId?: CommandEnum;
  tooltipId?: ToolTipEnum;
}

/**
 * ControlComponent가 처리 할 event 정보를 담는 interface 입니다.
 */
export interface IControlEvent {
  onClick?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onMouseEnter?: (e: React.MouseEvent<Element>) => void;
  onMouseLeave?: (e: React.MouseEvent<Element>) => void;
  onMouseDown?: (e: React.MouseEvent<Element>) => void;
  onMouseMove?: (e: React.MouseEvent<Element>) => void;
  onMouseUp?: (e: React.MouseEvent<Element>) => void;
}

/**
 * Control의 정보를 담는 interface입니다.
 */
export interface IControlInfo {
  type: ControlTypeEnum;
  attr: IControlAttr;
  eventhandler?: IControlEvent;
  subControlInfos?: Array<IControlInfo>;
}
