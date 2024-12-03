import RibbonGroupWrapperComponent from 'component/frame/ribbon/group/RibbonGroupWrapperComponent';
import useAppStore from 'hook/store/useAppStore';
import React from 'react';

/**
 * main page의 Ribbon 구성요소의 최 상단입니다.
 */
const RibbonComponent = (): React.JSX.Element => {
  const appStore = useAppStore();
  return (
    <div
      id="ribbon"
      role="toolbar"
      onMouseDown={() => {
        appStore.getAppContext().getEditableContext().setMouseLButtonPressed(false);
      }}
    >
      <RibbonGroupWrapperComponent />
    </div>
  );
};

export default RibbonComponent;
