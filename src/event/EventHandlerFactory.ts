import { boundMethod } from 'autobind-decorator';
import EventHandler from 'event/handler/EventHandler';

/**
 * EventHandler의 instance를 관리하는 Map type 입니다.
 */
export type EventHandlerMap = Map<number, EventHandler>;

/**
 * EventHandler를 생성하여 반환하는 factory입니다.
 * EventHandler는 state를 가지지 않기 때문에, 중복된 요청이 생길 경우
 * instance를 하나만 생성하여 같은 instance를 반환합니다.
 */
export default class EventHandlerFactory {
    /**
     * EventHandler의 instance를 관리하는 Map type 입니다.
     */
    private eventHandlerMap: EventHandlerMap;

    /**
     * 생성자
     */
    constructor() {
        this.eventHandlerMap = new Map();
    }

    /**
     * EventHandler의 생성자를 인자로 받아 해당 eventHandler의 instance를 반환하는 함수입니다.
     * 이미 instance가 있는 경우 같은 instance를 반환합니다.
     *
     * @param EventHandlerConstructor EventHandler의 생성자입니다.
     * @returns 새로 생성한 EventHandler의 instance
     */
    @boundMethod
    public getTargetEventHandler(EventHandlerConstructor: new () => EventHandler): EventHandler {
        // need implement
        return new EventHandler();
    }
}
