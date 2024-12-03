import React from 'react';
import classNames from 'classnames';
import { IDropdownMenuTitleProps } from 'types/component/frame/control/dropdown/menu/DropdownMenuTypes';
import LabelComponent from 'component/frame/control/label/LabelComponent';
import { ReactKeyEnum } from 'types/resource/ReactKeyEnum';

import styles from 'scss/component/frame/control/dropdown/menu/DropdownMenuTitle.module.scss';

/**
 * DropdownMenu 내부의 title을 생성하는 component 입니다.
 *
 * @param param0 IDropdownMenuTitleProps title 정보
 */
const DropdownMenuTitleComponent = ({
  dropdownMenuTitleInfo,
}: IDropdownMenuTitleProps): React.JSX.Element => {
  return (
    <div
      className={classNames({
        [styles.container]: true,
        [`${dropdownMenuTitleInfo.className}`]: dropdownMenuTitleInfo.className,
      })}
    >
      <LabelComponent
        attr={{
          reactKey: ReactKeyEnum.INVALID,
          label: dropdownMenuTitleInfo.label,
          className: classNames(styles.content),
        }}
      />
    </div>
  );
};

export default DropdownMenuTitleComponent;
