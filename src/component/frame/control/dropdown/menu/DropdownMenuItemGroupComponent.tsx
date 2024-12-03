import React from 'react';
import classNames from 'classnames';
import DropdownMenuFactoryComponent from 'component/frame/control/dropdown/menu/DropdownMenuFactoryComponent';
import { IDropdownMenuItemGroupProps } from 'types/component/frame/control/dropdown/menu/DropdownMenuTypes';

import styles from 'scss/component/frame/control/dropdown/menu/DropdownMenuItemGroup.module.scss';

/**
 * 하위에 여러개의 menu item을 가지는 group 형태의 component 입니다.
 *
 * @param param0 IDropdownMenuItemGroupProps group 정보
 */
const DropdownMenuItemGroupComponent = ({
  dropdownMenuItemGroupInfo,
  closeAllMenu,
}: IDropdownMenuItemGroupProps): React.JSX.Element => {
  const { className, subType, dropdownMenuSubItemInfos, onMouseLeave, onClick, closeOnClick } =
    dropdownMenuItemGroupInfo;

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles[subType ?? '']]: subType,
        [`${className}`]: className,
      })}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        if (closeOnClick) {
          closeAllMenu();
        }
        if (onClick) {
          onClick();
        }
      }}
      aria-hidden
    >
      {dropdownMenuSubItemInfos.map((dropdownMenuSubItemInfo, index) => {
        return (
          <DropdownMenuFactoryComponent
            dropdownMenuSubItemInfo={dropdownMenuSubItemInfo}
            closeAllMenu={closeAllMenu}
            // eslint-disable-next-line react/no-array-index-key
            key={`menu_${dropdownMenuSubItemInfo.type}_${index}`}
          />
        );
      })}
    </div>
  );
};

export default DropdownMenuItemGroupComponent;
