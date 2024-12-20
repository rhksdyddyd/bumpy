import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';

import styles from 'scss/component/node/slide/Slide.module.scss';
import useEventListener from 'hook/event/useEventListener';

const SlideEventComponent = (
  props: PropsWithChildren<TreeNodeComponentProps>
): React.JSX.Element => {
  const { model, children } = props;
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
  } = useEventListener(model);

  return (
    <div
      aria-hidden="true"
      className={classNames(styles.event)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {children}
    </div>
  );
};

export default SlideEventComponent;
