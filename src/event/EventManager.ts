import { boundMethod } from 'autobind-decorator';
import EventMapper from 'event/EventMapper';
import MouseEvent from 'event/types/MouseEvent';
import WheelEvent from 'event/types/WheelEvent';
import KeyEvent from 'event/types/KeyEvent';
import AppContext from 'store/context/AppContext';

/**
 * event를 처리하는 manager입니다
 * 각 event 별로 처리하는 함수를 가지고 있습니다.
 * 각 함수 내부에서는 event와 state에 맞는 event handler를 가져와서 실행합니다.
 */
export default class EventManager {
    /**
     * state 에 따른 event handler list 를 보관하는 자료구조 입니다.
     */
    private readonly eventMap: EventMapper;

    /**
     * 생성자
     */
    public constructor() {
        this.eventMap = new EventMapper();
    }

    @boundMethod
    public onMouseDown(event: MouseEvent, ctx: AppContext): void {
        this.eventMap.get(ctx.getEditableContext().getEventState())?.some(handler => handler.onMouseDown(event, ctx));
    }

    @boundMethod
    public onMouseUp(event: MouseEvent, ctx: AppContext): void {
        this.eventMap.get(ctx.getEditableContext().getEventState())?.some(handler => handler.onMouseUp(event, ctx));
    }

    @boundMethod
    public onMouseMove(event: MouseEvent, ctx: AppContext): void {
        this.eventMap.get(ctx.getEditableContext().getEventState())?.some(handler => handler.onMouseMove(event, ctx));
    }

    @boundMethod
    public onDrag(event: MouseEvent, ctx: AppContext): void {
        this.eventMap.get(ctx.getEditableContext().getEventState())?.some(handler => handler.onDrag(event, ctx));
    }

    @boundMethod
    public onWheel(event: WheelEvent, ctx: AppContext): void {
        this.eventMap.get(ctx.getEditableContext().getEventState())?.some(handler => handler.onWheel(event, ctx));
    }

    @boundMethod
    public onKeyDown(event: KeyEvent, ctx: AppContext): void {
        this.eventMap.get(ctx.getEditableContext().getEventState())?.some(handler => handler.onKeyDown(event, ctx));
    }

    @boundMethod
    public onKeyUp(event: KeyEvent, ctx: AppContext): void {
        this.eventMap.get(ctx.getEditableContext().getEventState())?.some(handler => handler.onKeyUp(event, ctx));
    }
}
