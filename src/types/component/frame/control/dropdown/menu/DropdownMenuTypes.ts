import { ResourceEnum } from 'types/resource/ResourceEnum';

// TODO
// key 추가하여 component에 적용할 것

/**
 * DropdownMenuComponent의 props를 정의한 interface 입니다.
 */
export interface IDropdownMenuProps {
  dropdownMenuInfo: IDropdownMenuInfo;
  closeAllMenu: () => void;
  closeMenu?: () => void; // submenu의 경우에 대한 처리
}

/**
 * DropdownMenuFactoryComponent의 props를 정의한 interface 입니다.
 */
export interface IDropdownMenuFactoryProps {
  dropdownMenuSubItemInfo: DropdownMenuSubItemInfoType;
  closeAllMenu(): void;
}

/**
 * DropdownMenuTitleComponent의 props를 정의한 interface 입니다.
 */
export interface IDropdownMenuTitleProps {
  dropdownMenuTitleInfo: IDropdownMenuTitleInfo;
}

/**
 * DropdownMenuSeparatorComponent의 props를 정의한 interface 입니다.
 */
export interface IDropdownMenuSeparatorProps {
  dropdownMenuSeparatorInfo: IDropdownMenuSeparatorInfo;
}

/**
 * DropdownMenuItemGroupComponent의 props를 정의한 interface 입니다.
 */
export interface IDropdownMenuItemGroupProps {
  dropdownMenuItemGroupInfo: IDropdownMenuItemGroupInfo;
  closeAllMenu: () => void;
}

/**
 * DropdownMenuItemComponent의 props를 정의한 interface 입니다.
 * DropdownMenuItemFactoryComponent, DropdownMenuItemComponent에서 사용합니다.
 */
export interface IDropdownMenuItemProps {
  dropdownMenuItemInfo: IDropdownMenuItemInfo;
  closeAllMenu: () => void;
}

/**
 * DropdownMenu의 상세 정보를 정의한 interface 입니다.
 */
export interface IDropdownMenuInfo {
  subType?: 'a1';
  className?: string;
  dropdownMenuSubItemInfos: DropdownMenuSubItemInfoType[];
}

/**
 * Dropdown 내부에 존재할 수 있는 subItem 들을 모은 type 입니다.
 */
export type DropdownMenuSubItemInfoType =
  | IDropdownMenuTitleInfo
  | IDropdownMenuSeparatorInfo
  | IDropdownMenuItemGroupInfo
  | IDropdownMenuItemInfo;

/**
 * DropdownMenuTitle의 상세 정보를 정의한 interface 입니다.
 */
export interface IDropdownMenuTitleInfo {
  type: 'title';
  className?: string;
  label: ResourceEnum;
}

/**
 * DropdownMenuSeparator의 상세 정보를 정의한 interface 입니다.
 */
export interface IDropdownMenuSeparatorInfo {
  type: 'separator';
  subType: 'full';
}

/**
 * DropdownMenuItemGroup의 상세 정보를 정의한 interface 입니다.
 */
export interface IDropdownMenuItemGroupInfo {
  type: 'group';
  subType?: 'a1';
  className?: string;
  dropdownMenuSubItemInfos: DropdownMenuSubItemInfoType[];
  closeOnClick?: boolean;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

/**
 * DropdownMenuItem의 상세 정보를 정의한 interface 입니다.
 */
export interface IDropdownMenuItemInfo {
  type: 'item';
  subType: 'a1';
  className?: string;
  label?: ResourceEnum;
  img?: ResourceEnum;
  imgWidth?: string;
  imgHeight?: string;
  disabled?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  dropdownMenu?: IDropdownMenuInfo; // for submenu
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<Element>) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  focusable?: boolean;
}
