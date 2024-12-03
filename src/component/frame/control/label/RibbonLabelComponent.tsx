import React from 'react';
import classNames from 'classnames';
import { IControlProps } from 'types/component/frame/control/ControlTypes';
import IconComponent from 'component/frame/control/button/IconComponent';
import { ControlSubTypeEnum } from 'types/component/frame/control/ControlSubTypeEnum';

import styles from 'scss/component/frame/control/label/RibbonLabel.module.scss';

/**
 * Ribbon에서 사용하는 control을 생성하는 component 입니다.
 * type 별로 여러 종류의 component를 반환합니다.
 *
 * @param param0 IControlProps control의 정보
 */
const RibbonLabelComponent = ({
  attr: { reactKey, subType, img, className },
  eventhandler,
}: IControlProps): React.JSX.Element => {
  const renderContent = () => {
    switch (subType) {
      case ControlSubTypeEnum.GI1:
        return (
          <>
            <IconComponent
              attr={{
                reactKey,
                img,
                width: '16px',
                height: '16px',
              }}
            />
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <button
      className={classNames({
        [styles.container]: true,
        [styles[subType ?? '']]: subType,
        [`${className}`]: className,
      })}
      onMouseEnter={eventhandler?.onMouseEnter}
      onMouseLeave={eventhandler?.onMouseLeave}
      onClick={eventhandler?.onClick}
      type="button"
    >
      {renderContent()}
    </button>
  );
};

export default RibbonLabelComponent;
