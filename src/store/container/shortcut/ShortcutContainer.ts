import { boundMethod } from 'autobind-decorator';
import AppStore from 'store/AppStore';
import { KeyCombination, ShortcutAction, ShortcutMap } from 'types/shortcut/ShortcutTypes';
import { CommandEnum } from 'types/store/command/CommandEnum';

export default class ShortcutContainer {
  private shortcutMap: ShortcutMap;

  private keyList: Array<string>;

  public constructor() {
    this.shortcutMap = new Map();
    this.keyList = [];
    this.initShortCut();
  }

  @boundMethod
  private initShortCut(): void {
    this.shortcutMap = new Map([
      [
        'CONTROL+Z',
        (appStore: AppStore, event: React.KeyboardEvent<HTMLDivElement>) => {
          event.stopPropagation();
          event.preventDefault();
          appStore.handleCommandEvent({ commandId: CommandEnum.UNDO });
        },
      ],
      [
        'CONTROL+Y',
        (appStore: AppStore, event: React.KeyboardEvent<HTMLDivElement>) => {
          event.stopPropagation();
          event.preventDefault();
          appStore.handleCommandEvent({ commandId: CommandEnum.REDO });
        },
      ],
      [
        'CONTROL+G',
        (appStore: AppStore, event: React.KeyboardEvent<HTMLDivElement>) => {
          event.stopPropagation();
          event.preventDefault();
          appStore.handleCommandEvent({ commandId: CommandEnum.GROUP_OBJECTS });
        },
      ],
      [
        'CONTROL+SHIFT+G',
        (appStore: AppStore, event: React.KeyboardEvent<HTMLDivElement>) => {
          event.stopPropagation();
          event.preventDefault();
          appStore.handleCommandEvent({ commandId: CommandEnum.UNGROUP });
        },
      ],
    ]);
  }

  @boundMethod
  public getShortCutAction(keyCombination: KeyCombination): Nullable<ShortcutAction> {
    return this.shortcutMap.get(keyCombination);
  }

  @boundMethod
  public getKeyList(): Array<string> {
    return this.keyList;
  }

  @boundMethod
  public pushKey(key: string): void {
    if (key === 'ControlLeft' || key === 'ShiftLeft' || key === 'ShiftRight' || key === 'AltLeft') {
      return;
    }
    const upperCaseKey = key.toLocaleUpperCase();
    if (this.keyList.includes(upperCaseKey)) {
      return;
    }
    this.keyList.push(upperCaseKey);
  }

  @boundMethod
  public clearKeyList(): void {
    this.keyList = [];
  }

  @boundMethod
  public clearKey(key: string): void {
    this.keyList = this.keyList.filter(i => i !== key.toLocaleUpperCase());
  }

  @boundMethod
  public getCombinationString(event: React.KeyboardEvent<HTMLDivElement>): string {
    const key = this.getConvertedKey(event.code);
    const isModifierKeyPressed = event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;

    if (isModifierKeyPressed === false) {
      return '';
    }

    this.pushKey(key);

    return `${this.getModifierKey(event)}${this.getKeyList().join('+')}`;
  }

  public getConvertedKey(code: string): string {
    return code.replace('Key', '');
  }

  private getModifierKey(event: React.KeyboardEvent<HTMLDivElement>): string {
    const modifierKeyList = [
      { isModifier: event.ctrlKey || event.metaKey, modifierKey: 'CONTROL' },
      { isModifier: event.altKey, modifierKey: 'ALT' },
      { isModifier: event.shiftKey, modifierKey: 'SHIFT' },
    ];
    let modifierKey = '';

    modifierKeyList.forEach(e => {
      if (e.isModifier) {
        modifierKey += `${e.modifierKey}+`;
      }
    });

    return modifierKey;
  }
}
