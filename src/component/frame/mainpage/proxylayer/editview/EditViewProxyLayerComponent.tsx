import React, { useLayoutEffect } from 'react';
import useAppStore from 'hook/store/useAppStore';
import useRerender from 'hook/store/useRerender';
import EditViewEventProxyComponent from './EditViewEventProxyComponent';

const EditViewProxyLayerComponent = (): React.JSX.Element => {
  const appStore = useAppStore();
  const { triggerRerender } = useRerender();

  const proxyLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();

  useLayoutEffect(() => {
    proxyLayerInfoContainer.setRerenderEditViewProxyLayerFunction(triggerRerender);
  }, []);

  const isEnabled = proxyLayerInfoContainer.getIsEditViewProxyLayerEnabled();

  return <>{isEnabled && <EditViewEventProxyComponent />}</>;
};

export default EditViewProxyLayerComponent;
