import React, { useLayoutEffect } from 'react';
import useAppStore from 'hook/store/useAppStore';
import useRerender from 'hook/store/useRerender';
import AppAreaEventProxyComponent from './AppAreaEventProxyComponent';
import AppAreaCursorStyleProxyComponent from './AppAreaCursorStyleProxyComponent';
import AppAreaEventBlockComponent from './AppAreaEventBlockComponent';

const AppAreaProxyLayerComponent = (): React.JSX.Element => {
  const appStore = useAppStore();
  const { triggerRerender } = useRerender();

  const proxyLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();

  useLayoutEffect(() => {
    proxyLayerInfoContainer.setRerenderAppAreaProxyLayerFunction(triggerRerender);
  }, []);

  const isEnabled = proxyLayerInfoContainer.getIsAppAreaProxyLayerEnabled();
  const isEventProxyEnabled = proxyLayerInfoContainer.getIsAppAreaEventProxyEnabled();
  const isEventBlocked = proxyLayerInfoContainer.getIsAppAreaEventBlocked();

  return (
    <>
      {isEnabled && (
        <>
          {isEventProxyEnabled &&
            (isEventBlocked ? <AppAreaEventBlockComponent /> : <AppAreaEventProxyComponent />)}
          <AppAreaCursorStyleProxyComponent />
        </>
      )}
    </>
  );
};

export default AppAreaProxyLayerComponent;
