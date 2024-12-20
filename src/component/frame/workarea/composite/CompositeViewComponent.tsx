import React, { useRef } from 'react';
import { ICompositeViewProps } from 'types/component/frame/workarea/composite/CompositeViewTypes';
import classNames from 'classnames';
import useCompositeViewDivider from 'hook/component/frame/workarea/composite/useCompositeViewDivider';

import styles from 'scss/component/frame/workarea/composite/CompositeView.module.scss';

const CompositeViewComponent = ({
  firstChild,
  secondChild,
  ratio,
  flexDirection,
}: ICompositeViewProps): React.JSX.Element => {
  const compositeViewRef = useRef<HTMLDivElement>(null);
  const firstChildRef = useRef<HTMLDivElement>(null);
  const dividerViewRef = useRef<HTMLDivElement>(null);
  const dividerControllerRef = useRef<HTMLDivElement>(null);

  const { firstChildCssStyle, handleMouseDownCapture } = useCompositeViewDivider({
    compositeViewRef,
    firstChildRef,
    dividerViewRef,
    dividerControllerRef,
    ratio,
    flexDirection,
  });

  return (
    <div
      ref={compositeViewRef}
      className={classNames({ [styles.container]: true }, { [styles[flexDirection]]: true })}
    >
      <div
        className={classNames({ [styles.child]: true }, { [styles[flexDirection]]: true })}
        ref={firstChildRef}
        style={firstChildCssStyle}
      >
        {firstChild}
      </div>
      <div
        role="grid"
        tabIndex={-1}
        ref={dividerViewRef}
        className={classNames({ [styles.divider_view]: true }, { [styles[flexDirection]]: true })}
      />
      <div
        role="grid"
        tabIndex={-1}
        ref={dividerControllerRef}
        className={classNames(
          { [styles.divider_controller]: true },
          { [styles[flexDirection]]: true }
        )}
        onMouseDownCapture={handleMouseDownCapture}
      />
      <div
        className={classNames(
          { [styles.child]: true },
          { [styles.second]: true },
          { [styles[flexDirection]]: true }
        )}
      >
        {secondChild}
      </div>
    </div>
  );
};

export default CompositeViewComponent;
