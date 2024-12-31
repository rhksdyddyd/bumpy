import useAppStore from 'hook/store/useAppStore';

type Hook = () => {
  shortcutHandler: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  clearKeyHandler: (event: React.KeyboardEvent<HTMLDivElement>) => void;
};

const useShortcut: Hook = () => {
  const appStore = useAppStore();
  const shortcutContainer = appStore.getAppContext().getEditableContext().getShortcutContainer();

  const shortcutHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const combinationString = shortcutContainer.getCombinationString(event);

    if (combinationString === '') {
      return;
    }

    const shortcutAction = shortcutContainer.getShortCutAction(combinationString);

    if (shortcutAction !== undefined) {
      event.preventDefault();
      event.stopPropagation();
      shortcutAction(appStore, event);
    }
  };

  const clearKeyHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
      shortcutContainer.clearKeyList();
    }
    const key = shortcutContainer.getConvertedKey(event.code);
    shortcutContainer.clearKey(key);
  };

  return {
    shortcutHandler,
    clearKeyHandler,
  };
};

export default useShortcut;
