import MouseEvent from 'event/types/MouseEvent';
import WheelEvent from 'event/types/WheelEvent';
import KeyEvent from 'event/types/KeyEvent';
import AppContext from 'store/context/AppContext';
import Identifiable from 'util/common/Identifiable';

/**
 * event 를 처리하는 event handler class 입니다.
 * event는 우선순위에 따라 여러 event handler들을 chain으로 구성하여 처리하며,
 * event 종류별로 적합한 함수를 호출하여 처리합니다.
 * chain을 구성하는 하나의 event handler의 event 처리 함수에서 true를 반환하면,
 * 다음 chain으로 넘어가지 않고 event chain을 종료합니다.
 */
class EventHandler {
    /**
     * mouse down event에 대한 처리 함수 입니다.
     *
     * @param event 발생한 event
     * @param ctx 현재 app 정보를 담고 있는 AppContext
     * @returns event 처리가 완전히 완료되었는지의 여부
     */
    public onMouseDown(event: MouseEvent, ctx: AppContext): boolean {
        return false;
    }

    /**
     * mouse up event에 대한 처리 함수 입니다.
     *
     * @param event 발생한 event
     * @param ctx 현재 app 정보를 담고 있는 AppContext
     * @returns event 처리가 완전히 완료되었는지의 여부
     */
    public onMouseUp(event: MouseEvent, ctx: AppContext): boolean {
        return false;
    }

    /**
     * mouse move event에 대한 처리 함수 입니다.
     *
     * @param event 발생한 event
     * @param ctx 현재 app 정보를 담고 있는 AppContext
     * @returns event 처리가 완전히 완료되었는지의 여부
     */
    public onMouseMove(event: MouseEvent, ctx: AppContext): boolean {
        return false;
    }

    /**
     * mouse drag event에 대한 처리 함수 입니다.
     *
     * @param event 발생한 event
     * @param ctx 현재 app 정보를 담고 있는 AppContext
     * @returns event 처리가 완전히 완료되었는지의 여부
     */
    public onDrag(event: MouseEvent, ctx: AppContext): boolean {
        return false;
    }

    /**
     * mouse wheel event에 대한 처리 함수 입니다.
     *
     * @param event 발생한 event
     * @param ctx 현재 app 정보를 담고 있는 AppContext
     * @returns event 처리가 완전히 완료되었는지의 여부
     */
    public onWheel(event: WheelEvent, ctx: AppContext): boolean {
        return false;
    }

    /**
     * key down event에 대한 처리 함수 입니다.
     *
     * @param event 발생한 event
     * @param ctx 현재 app 정보를 담고 있는 AppContext
     * @returns event 처리가 완전히 완료되었는지의 여부
     */
    public onKeyDown(event: KeyEvent, ctx: AppContext): boolean {
        return false;
    }

    /**
     * key up event에 대한 처리 함수 입니다.
     *
     * @param event 발생한 event
     * @param ctx 현재 app 정보를 담고 있는 AppContext
     * @returns event 처리가 완전히 완료되었는지의 여부
     */
    public onKeyUp(event: KeyEvent, ctx: AppContext): boolean {
        return false;
    }
}

export default class extends Identifiable(EventHandler) {}
