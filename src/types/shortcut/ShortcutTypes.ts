import AppStore from 'store/AppStore';

export type KeyCombination = string;

export type ShortcutMap = Map<KeyCombination, ShortcutAction>;

export type ShortcutAction = (
  appStore: AppStore,
  event: React.KeyboardEvent<HTMLDivElement>
) => void;
