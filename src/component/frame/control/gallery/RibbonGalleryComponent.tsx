import React from 'react';
import classNames from 'classnames';
import { IControlInfo } from 'types/component/frame/control/ControlTypes';
import { IRibbonGalleryProps } from 'types/component/frame/control/gallery/RibbonGalleryTypes';
import useDropdownMenu from 'hook/component/frame/control/dropdown/useDropdownMenu';
import WithControlHandlerComponent from 'component/frame/controlhandler/WithControlHandlerComponent';
import ArrowButtonComponent from 'component/frame/control/button/ArrowButtonComponent';
import MoreItemsGalleryArrowButtonComponent from 'component/frame/control/button/MoreItemsGalleryArrowButtonComponent';
import DropdownMenuComponent from 'component/frame/control/dropdown/menu/DropdownMenuComponent';
import { ReactKeyEnum } from 'types/resource/ReactKeyEnum';

import styles from 'scss/component/frame/control/gallery/RibbonGallery.module.scss';

/**
 * Ribbon 내부의 Gallery를 생성하는 component 입니다.
 *
 * @param param0 IRibbonGalleryProps Gallery 정보
 */
const RibbonGalleryComponent = ({
  attr,
  subControlInfos,
  children,
  eventhandler,
}: IRibbonGalleryProps): React.JSX.Element => {
  const { isOpen, targetRef, menuRef, toggleMenu, closeMenu } = useDropdownMenu();

  return (
    <>
      <div
        role="group"
        className={classNames({
          [styles.container]: true,
          [styles[attr?.subType ?? '']]: attr?.subType,
          [`${attr?.className}`]: attr?.className,
        })}
        ref={targetRef}
      >
        {children}
        <div
          className={classNames({
            [styles.content]: true,
            [styles[attr?.subType ?? '']]: attr?.subType,
          })}
        >
          {subControlInfos !== undefined &&
            subControlInfos.map((controlInfo: IControlInfo) => {
              return (
                <WithControlHandlerComponent
                  controlInfo={controlInfo}
                  key={controlInfo.attr.reactKey}
                />
              );
            })}
        </div>
        <div className={classNames({ [styles['arrow-container']]: true })}>
          <ArrowButtonComponent
            attr={{
              reactKey: ReactKeyEnum.INVALID,
              className: classNames({ [styles.arrow]: true, [styles.up]: true }),
              arrowType: 'up',
              width: '8px',
              height: '8px',
              disabled: attr?.disableUpButton,
            }}
            eventhandler={{
              onClick: eventhandler?.onArrowUpButtonClick,
              onMouseLeave: eventhandler?.onMouseLeave,
            }}
          />
          <ArrowButtonComponent
            attr={{
              reactKey: ReactKeyEnum.INVALID,
              className: classNames({ [styles.arrow]: true, [styles.down]: true }),
              arrowType: 'down',
              width: '8px',
              height: '8px',
              disabled: attr?.disableDownButton,
            }}
            eventhandler={{
              onClick: eventhandler?.onArrowDownButtonClick,
              onMouseLeave: eventhandler?.onMouseLeave,
            }}
          />
          <MoreItemsGalleryArrowButtonComponent
            attr={{
              reactKey: ReactKeyEnum.INVALID,
              className: classNames({ [styles.arrow]: true, [styles.more]: true }),
              disabled: attr?.disableMoreButton,
            }}
            eventhandler={{
              onClick: e => {
                toggleMenu();
                if (eventhandler?.onClick) {
                  eventhandler?.onClick(e);
                }
              },
              onMouseLeave: eventhandler?.onMouseLeave,
            }}
          />
        </div>
      </div>
      {isOpen && attr?.dropdownMenuInfo && (
        <DropdownMenuComponent
          closeAllMenu={closeMenu}
          dropdownMenuInfo={attr?.dropdownMenuInfo}
          ref={menuRef}
        />
      )}
    </>
  );
};

export default RibbonGalleryComponent;
