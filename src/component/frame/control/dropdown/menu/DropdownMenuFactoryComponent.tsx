import React from 'react';
import { IDropdownMenuFactoryProps } from 'types/component/frame/control/dropdown/menu/DropdownMenuTypes';
import DropdownMenuItemGroupComponent from 'component/frame/control/dropdown/menu/DropdownMenuItemGroupComponent';
import DropdownMenuItemFactoryComponent from 'component/frame/control/dropdown/menu/DropdownMenuItemFactoryComponent';
import DropdownMenuSeparatorComponent from 'component/frame/control/dropdown/menu/DropdownMenuSeparatorComponent';
import DropdownMenuTitleComponent from 'component/frame/control/dropdown/menu/DropdownMenuTitleComponent';

/**
 * DropdownMenu 하위 요소를 type 별로 구분하여 생성하는 factory component 입니다.
 *
 * @param param0 IDropdownMenuFactoryProps menu control 정보
 */
const DropdownMenuFactoryComponent = ({
  dropdownMenuSubItemInfo,
  closeAllMenu,
}: IDropdownMenuFactoryProps): React.JSX.Element => {
  switch (dropdownMenuSubItemInfo.type) {
    case 'title':
      return <DropdownMenuTitleComponent dropdownMenuTitleInfo={dropdownMenuSubItemInfo} />;
    case 'group':
      return (
        <DropdownMenuItemGroupComponent
          dropdownMenuItemGroupInfo={dropdownMenuSubItemInfo}
          closeAllMenu={closeAllMenu}
        />
      );
    case 'separator':
      return <DropdownMenuSeparatorComponent dropdownMenuSeparatorInfo={dropdownMenuSubItemInfo} />;
    default:
      return (
        <DropdownMenuItemFactoryComponent
          dropdownMenuItemInfo={dropdownMenuSubItemInfo}
          closeAllMenu={closeAllMenu}
        />
      );
  }
};

export default DropdownMenuFactoryComponent;
