import React from 'react';
import classNames from 'classnames';
import { IDropdownMenuSeparatorProps } from 'types/component/frame/control/dropdown/menu/DropdownMenuTypes';

import styles from 'scss/component/frame/control/dropdown/menu/DropdownMenuSeparator.module.scss';

/**
 * Dropdown 내부의 separator를 생성하는 component 입니다.
 *
 * @param param0 IDropdownMenuSeparatorProps separator 정보
 */
const DropdownMenuSeparatorComponent = ({
  dropdownMenuSeparatorInfo,
}: IDropdownMenuSeparatorProps): React.JSX.Element => {
  return (
    <div>
      <div
        className={classNames({
          [styles.line]: true,
          [styles[dropdownMenuSeparatorInfo.subType ?? '']]: dropdownMenuSeparatorInfo.subType,
        })}
      />
    </div>
  );
};

export default DropdownMenuSeparatorComponent;
