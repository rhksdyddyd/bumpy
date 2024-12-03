import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { IDropdownMenuProps } from 'types/component/frame/control/dropdown/menu/DropdownMenuTypes';
import DropdownMenuFactoryComponent from 'component/frame/control/dropdown/menu/DropdownMenuFactoryComponent';

import styles from 'scss/component/frame/control/dropdown/menu/DropdownMenu.module.scss';

/**
 * DropdownMenu를 생성하는 component 입니다.
 *
 * @param IDropdownMenuProps DropdownMenu 정보
 */
const DropdownMenuComponent = forwardRef<HTMLDivElement, IDropdownMenuProps>(
  ({ dropdownMenuInfo, closeAllMenu }: IDropdownMenuProps, ref): React.JSX.Element => {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        className={classNames({
          [styles.container]: true,
          [styles[dropdownMenuInfo.subType ?? '']]: dropdownMenuInfo.subType,
          [`${dropdownMenuInfo.className}`]: dropdownMenuInfo.className,
        })}
        role="menu"
      >
        {dropdownMenuInfo.dropdownMenuSubItemInfos.map((dropdownMenuSubItemInfo, index: number) => {
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
  }
);

export default DropdownMenuComponent;
