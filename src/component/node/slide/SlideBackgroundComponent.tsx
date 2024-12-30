import React from 'react';
import SlideModel from 'model/node/slide/SlideModel';
import classNames from 'classnames';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';

import styles from 'scss/component/node/slide/Slide.module.scss';

const SlideBackgroundComponent = React.forwardRef(
  (props: TreeNodeComponentProps, ref: React.ForwardedRef<SVGSVGElement>): React.JSX.Element => {
    const { model, zoomRatio } = props;
    const slideModel = model as SlideModel;

    const originalSize = slideModel.getSize();
    const width = originalSize.width * zoomRatio;
    const height = originalSize.height * zoomRatio;

    const fillInfo = slideModel.getFillInfo();
    const fill = fillInfo === undefined ? '#FFFFFF' : fillInfo.getFill()?.getFillString();

    return (
      <div aria-hidden className={classNames(styles.slide_background)}>
        <svg
          ref={ref}
          style={{
            width,
            height,
          }}
        >
          <rect
            style={{
              fill,
              width,
              height,
              strokeWidth: 1,
              stroke: '#000',
            }}
          />
        </svg>
      </div>
    );
  }
);

export default SlideBackgroundComponent;
