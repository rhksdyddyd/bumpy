import { IControlEvent, ICustomControlProps } from 'types/component/frame/control/ControlTypes';
import { IDropdownAttr } from 'types/component/frame/control/dropdown/DropdownTypes';

/**
 * RibbonGalleryComponent의 custom props를 정의한 interface 입니다.
 */
export interface IRibbonGalleryProps
  extends ICustomControlProps<IRibbonGalleryAttr, IRibbonGalleryEvent> {}

/**
 * RibbonGalleryComponent의 custom attr를 정의한 interface 입니다.
 */
export interface IRibbonGalleryAttr extends IDropdownAttr {
  disableMoreButton?: boolean;
  disableUpButton?: boolean;
  disableDownButton?: boolean;
}

/**
 * RibbonGalleryComponent의 custom event를 정의한 interface 입니다.
 */
export interface IRibbonGalleryEvent extends IControlEvent {
  onArrowUpButtonClick?: (e: React.MouseEvent<Element>) => void;
  onArrowDownButtonClick?: (e: React.MouseEvent<Element>) => void;
}
