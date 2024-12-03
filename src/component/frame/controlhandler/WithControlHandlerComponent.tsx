import getControl from 'component/frame/control/getControl';
import useAppStore from 'hook/store/useAppStore';
import React from 'react';
import { IWithControlHandlerComponentProps } from 'types/component/frame/contolhandler/WithControlHandlerTypes';

/**
 * Control을 감싸 추가적인 기능을 부여하는 HOC 입니다.
 *
 * @param param0 IWithControlHandlerComponentProps control의 정보
 */
const WithControlHandlerComponent = ({
  controlInfo,
}: IWithControlHandlerComponentProps): React.JSX.Element => {
  const appStore = useAppStore();
  const editableContext = appStore.getAppContext().getEditableContext();
  const uiContainer = editableContext.getUIContainer();
  const controlHandlerContainer = uiContainer.getControlHandlerContainer();

  const Control = getControl(controlInfo.type);

  const handledControlProps = controlInfo.attr.commandId
    ? controlHandlerContainer.getHandledControlProps(controlInfo, appStore)
    : undefined;
  const subControlInfos = handledControlProps?.subControlInfos ?? controlInfo.subControlInfos;
  const children = handledControlProps?.children;
  const eventhandler = { ...(handledControlProps?.eventhandler ?? controlInfo.eventhandler) };

  return (
    <Control
      attr={{
        ...controlInfo.attr,
        ...handledControlProps?.attr,
      }}
      subControlInfos={subControlInfos}
      eventhandler={eventhandler}
    >
      {children}
    </Control>
  );
};

export default WithControlHandlerComponent;
