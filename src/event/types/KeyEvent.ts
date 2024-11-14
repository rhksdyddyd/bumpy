import { boundMethod } from 'autobind-decorator';
import React from 'react';
import BaseEvent from 'event/types/BaseEvent';
import TreeNode from 'node/TreeNode';
import isMac from 'util/common/isMac';

/**
 * EventHandler 에서 사용하는 keyboard event type 입니다.
 * React event 의 wrapper 입니다.
 */
class KeyEvent extends BaseEvent {
    /**
     * 실제로 발생 한 react key event
     */
    private readonly event: React.KeyboardEvent<HTMLElement>;

    /**
     * 생성자
     *
     * @param event react key event 입니다.
     * @param targetModel event가 발생한 TreeNode
     */
    public constructor(event: React.KeyboardEvent<HTMLElement>, eventTargetModel: TreeNode) {
        super(eventTargetModel);
        this.event = event;
    }

    /**
     * Mac 에서는 option, 나머지 플랫폼에서는 alt 를 나타내는 alt key 가 눌린 상태인지 확인합니다.
     *
     * @returns alt key 가 눌린 경우 true
     */
    @boundMethod
    public isAltDown(): boolean {
        return this.event.altKey;
    }

    /**
     * Mac 에서는 control, 나머지 플랫폼에서는 ctrl 을 나타내는 ctrl key 가 눌린 상태인지 확인합니다.
     *
     * @returns ctrl key 가 눌린 경우 true
     */
    @boundMethod
    public isCtrlDown(): boolean {
        return this.event.ctrlKey;
    }

    /**
     * shift 키가 눌려있는 상태인지 확인합니다.
     *
     * @returns shift 키가 눌려있는 경우 true
     */
    @boundMethod
    public isShiftDown(): boolean {
        return this.event.shiftKey;
    }

    /**
     * Mac 에서는 command, Windows 에서는 windows 키를 나타내는 meta key 가 눌린 상태인지 확인합니다.
     *
     * @returns meta key 가 눌린 경우 true
     */
    @boundMethod
    public isMetaDown(): boolean {
        return this.event.metaKey;
    }

    /**
     * Modifier 가 눌린 상태인지 확인합니다.
     * Mac 에서 modifier 는 command, 나머지에서는 ctrl 이 modifier 입니다.
     *
     * @returns modifier 가 눌린 경우 true
     */
    @boundMethod
    public isModifierDown(): boolean {
        return isMac() ? this.event.metaKey && !this.event.altKey : this.event.ctrlKey && !this.event.altKey;
    }

    /**
     * CapsLock이 활성화 되어있는 상태인지 확인합니다.
     *
     * @returns CapsLock이 활성화 되어있으면 true
     */
    @boundMethod
    public isCapsLockDown(): boolean {
        return this.event.getModifierState('CapsLock');
    }

    /**
     * ScrollLock이 활성화 되어 있는 상태인지 확인합니다.
     *
     * @returns ScrollLock이 활성화 되어있으면 true
     */
    @boundMethod
    public isScrollLockDown(): boolean {
        return this.event.getModifierState('ScrollLock');
    }

    /**
     * NumLock이 활성화 되어 있는 상태인지 확인합니다.
     *
     * @returns NumLock이 활성화 되어있으면 true
     */
    @boundMethod
    public isNumLockDown(): boolean {
        return this.event.getModifierState('NumLock');
    }

    /**
     * event의 key를 반환합니다.
     *
     * @returns event.key
     */
    @boundMethod
    public getKey(): string {
        return this.event.key;
    }

    /**
     * event의 code 를 반환합니다. (Key code 는 deprecated 입니다.)
     *
     * @returns key의 code를 나타내는 string
     */
    @boundMethod
    public getCode(): string {
        return this.event.nativeEvent.code;
    }

    /**
     * react event를 반환합니다.
     *
     * @returns this.event
     */
    @boundMethod
    protected getEvent(): React.SyntheticEvent<HTMLElement> {
        return this.event;
    }

    /**
     * 한글 등의 문자를 조합중인지 반환합니다.
     *
     * @returns 한글 등의 문자를 조합중인지의 여부
     */
    public getIsComposing(): boolean {
        return (this.getNativeEvent() as KeyboardEvent).isComposing;
    }
}

export default KeyEvent;
