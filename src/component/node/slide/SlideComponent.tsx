import useSlideSize from 'hook/component/node/slide/useSlideSize';
import useRenderChildren from 'hook/component/node/useRenderChildren';
import React from 'react';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';

import styles from 'scss/component/node/slide/Slide.module.scss';
import classNames from 'classnames';
import useTreeNodeRerender from 'hook/component/node/useTreeNodeRerender';
import SlideBackgroundComponent from './SlideBackgroundComponent';
import SlideEventComponent from './SlideEventComponent';

const SlideComponent = (props: TreeNodeComponentProps): React.JSX.Element => {
  useTreeNodeRerender(props);
  const { parentHTMLElementRef, renderedChildren } = useRenderChildren(props);
  const { contentsWrapperRef, contentsRef, slideBackgroundRef } = useSlideSize(props);

  return (
    <div className={classNames(styles.container)}>
      <div ref={contentsWrapperRef} className={classNames(styles.contents_wrapper)}>
        <SlideEventComponent {...props}>
          <div ref={contentsRef} className={classNames(styles.slide_background_wrapper)}>
            <SlideBackgroundComponent ref={slideBackgroundRef} {...props} />
            <div ref={parentHTMLElementRef}>{renderedChildren}</div>
          </div>
        </SlideEventComponent>
      </div>
    </div>
  );
};

export default SlideComponent;
