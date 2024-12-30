import React, { useLayoutEffect } from 'react';
import useAppStore from 'hook/store/useAppStore';
import useRerender from 'hook/store/useRerender';
import AppAreaEventProxyComponent from './AppAreaEventProxyComponent';
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
  const isEventBlocked = proxyLayerInfoContainer.getIsAppAreaEventBlocked();

  return (
    <>
      {isEnabled && (
        <>{isEventBlocked ? <AppAreaEventBlockComponent /> : <AppAreaEventProxyComponent />}</>
      )}
    </>
  );
};

export default AppAreaProxyLayerComponent;
