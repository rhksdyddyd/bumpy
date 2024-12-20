import useCursorStyle from 'hook/cursor/useCursorStyle';
import useAppStore from 'hook/store/useAppStore';

type Hook = () => {
  appAreaCursorStyle?: string;
};

const useAppAreaProxyCursorStyle: Hook = () => {
  const appStore = useAppStore();
  const proxyLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();

  const appAreaCursorInfo = proxyLayerInfoContainer.getAppAreaCursorInfo();

  return {
    appAreaCursorStyle: useCursorStyle(appAreaCursorInfo).cursorStyle,
  };
};

export default useAppAreaProxyCursorStyle;
