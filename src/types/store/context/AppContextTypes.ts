import { ICommandProps } from '../command/CommandTypes';

/**
 * ReadOnlyContext를 초기화하기 위해 사용하는 interface 입니다.
 */
export interface IReadOnlyContextInitProp {
  handleCommandEventFunction: (props: ICommandProps) => void;
}

/**
 * EditableContext를 초기화하기 위하여 필요한 정보입니다.
 */
export interface IEditableContextInitProp {}

/**
 * AppContext를 초기화 하기 위하여 필요한 정보입니다.
 */
export interface IAppContextInitProp {
  readOnlyContextInitProp: IReadOnlyContextInitProp;
  editableContextInitProp: IEditableContextInitProp;
}
