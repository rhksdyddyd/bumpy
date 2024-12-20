import useCursorStyle from 'hook/cursor/useCursorStyle';
import useAppStore from 'hook/store/useAppStore';

type Hook = () => {
  editViewCursorStyle?: string;
};

const useEditViewProxyCursorStyle: Hook = () => {
  const appStore = useAppStore();
  const proxyLayerInfoContainer = appStore
    .getAppContext()
    .getEditableContext()
    .getProxyLayerInfoContainer();

  const editViewCursorInfo = proxyLayerInfoContainer.getEditViewCursorInfo();

  return {
    editViewCursorStyle: useCursorStyle(editViewCursorInfo).cursorStyle,
  };
};

export default useEditViewProxyCursorStyle;
