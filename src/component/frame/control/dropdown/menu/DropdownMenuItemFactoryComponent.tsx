import React from 'react';
import classNames from 'classnames';
import { IDropdownMenuItemProps } from 'types/component/frame/control/dropdown/menu/DropdownMenuTypes';
import IconComponent from 'component/frame/control/button/IconComponent';
import { ReactKeyEnum } from 'types/resource/ReactKeyEnum';

import styles from 'scss/component/frame/control/dropdown/menu/DropdownMenuItem.module.scss';

/**
 * Dropdown에서 사용하는 menu item을 생성하는 component 입니다.
 * DropdownMenuItemFactoryComponent 에서 호출합니다.
 *
 * @param param0 IDropdownMenuItemProps menu item 정보
 */
const DropdownMenuItemComponent = ({
  dropdownMenuItemInfo,
  closeAllMenu,
}: IDropdownMenuItemProps): React.JSX.Element => {
  switch (dropdownMenuItemInfo.subType) {
    case 'a1':
      return (
        <IconComponent
          attr={{
            reactKey: ReactKeyEnum.INVALID,
            className: styles.content,
            img: dropdownMenuItemInfo.img,
            width: dropdownMenuItemInfo.imgWidth,
            height: dropdownMenuItemInfo.imgHeight,
          }}
        >
          {[dropdownMenuItemInfo.children]}
        </IconComponent>
      );
    default:
      return <>{dropdownMenuItemInfo.children}</>;
  }
};

/**
 * subType에 따른 여러 종류의 menu item을 생성하는 factory component 입니다.
 *
 * @param param0 IDropdownMenuItemProps menu item 정보
 */
const DropdownMenuItemFactoryComponent = ({
  dropdownMenuItemInfo,
  closeAllMenu,
}: IDropdownMenuItemProps): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div
      role="menuitem"
      tabIndex={-1}
      className={classNames({
        [styles.container]: true,
        [styles.disabled]: dropdownMenuItemInfo.disabled,
        [styles.selected]: dropdownMenuItemInfo.selected,
        [styles[dropdownMenuItemInfo.subType]]: true,
        [`${dropdownMenuItemInfo.className}`]: dropdownMenuItemInfo.className,
      })}
      ref={ref}
      style={dropdownMenuItemInfo.style}
      onClick={() => {
        closeAllMenu();

        dropdownMenuItemInfo.onClick?.();
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          ref.current?.click();
        }
      }}
    >
      <DropdownMenuItemComponent
        dropdownMenuItemInfo={dropdownMenuItemInfo}
        closeAllMenu={closeAllMenu}
      />
    </div>
  );
};

export default DropdownMenuItemFactoryComponent;
