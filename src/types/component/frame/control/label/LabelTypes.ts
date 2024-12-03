import {
  IControlAttr,
  IControlEvent,
  ICustomControlProps,
} from 'types/component/frame/control/ControlTypes';

/**
 * LabelComponent의 props를 정의한 interface 입니다.
 */
export interface ILabelProps extends ICustomControlProps<ILabelAttr, IControlEvent> {}

/**
 * LabelComponent의 custom attribute를 정의한 interface 입니다.
 */
export interface ILabelAttr extends IControlAttr {
  /**
   * label에 연결 할 control의 id를 직접 명시합니다.
   * ```
   * const inputId = useId(); // 페이지 내에서 고유해야하기 때문에 useId hook 으로 고유한 ID 생성
   * <LabelComponent htmlFor={inputId} />
   * <TextBoxComponent id={inputId} />
   * ```
   */
  htmlFor?: string;
  /**
   * <label> 요소 내부에 control을 포함하여 <label>을 클릭 시 내부의 control을 활성화 합니다.
   * ```
   * <LabelComponent>
   *   <TextBoxComponent />
   * </LabelComponent>
   * ```
   */
  children?: React.ReactNode[];
}
