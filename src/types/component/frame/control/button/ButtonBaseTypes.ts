import { ResourceEnum } from 'types/resource/ResourceEnum';
import { IImgResProps } from 'types/component/frame/control/resource/ImgResourceTypes';

/**
 * ButtonBaseComponent의 props를 정의한 interface 입니다.
 */
export interface IButtonBaseProps {
  className?: string;
  disabled?: boolean;
  tabIndex?: number;
  selected?: boolean;
  id?: string;
  onClick?(e: React.MouseEvent): void;
  onDoubleClick?(e: React.MouseEvent): void;
  onMouseEnter?(e: React.MouseEvent): void;
  onMouseLeave?(e: React.MouseEvent): void;
  onMouseDown?(e: React.MouseEvent): void;
  onMouseUp?(e: React.MouseEvent): void;
}

/**
 * ButtonBaseLabelComponent의 props를 정의한 interface 입니다.
 */
export interface IButtonBaseLabelProps {
  label?: ResourceEnum;
  className?: string;
}

/**
 * ButtonBaseIconComponent의 props를 정의한 interface 입니다.
 */
export interface IButtonBaseIconProps extends IImgResProps {}
