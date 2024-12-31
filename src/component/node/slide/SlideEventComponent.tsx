import React, { PropsWithChildren, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';

import styles from 'scss/component/node/slide/Slide.module.scss';
import useEventListener from 'hook/event/useEventListener';

const SlideEventComponent = (
  props: PropsWithChildren<TreeNodeComponentProps>
): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { model, children } = props;
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
  } = useEventListener(model);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      role="none"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className={classNames(styles.event)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={() => {
        ref.current?.focus();
      }}
    >
      {children}
    </div>
  );
};

export default SlideEventComponent;
