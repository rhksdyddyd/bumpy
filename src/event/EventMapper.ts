import { boundMethod } from 'autobind-decorator';
import EventHandler from 'event/handler/EventHandler';
import EventHandlerFactory from 'event/EventHandlerFactory';
import EventState from 'event/types/EventState';

/**
 * EventState에 따라 eventHandlerList를 관리하는 map type입니다.
 */
export type EventMap = Map<EventState, EventHandler[]>;

/**
 * EventMap을 구성할 생성자 정보를 가지고 있는 map type입니다.
 */
type EventConstructorMap = Map<EventState, (new () => EventHandler)[]>;

/**
 * EventState 에 따라 어떤 event handler 들이 순서대로 동작하는 지를 관리합니다.
 */
class EventMapper {
    /**
     * eventHandler를 생성 하는 factory
     */
    private readonly eventHandlerFactory: EventHandlerFactory;

    /**
     * EventState에 따라 eventHandlerList를 관리하는 map
     */
    private eventMap: EventMap;

    /**
     * 생성자
     */
    public constructor() {
        this.eventHandlerFactory = new EventHandlerFactory();
        this.eventMap = new Map();
        this.init();
    }

    /**
     * EventConstructorMap정보를 기준으로 eventMap을 구성합니다.
     */
    @boundMethod
    private init(): void {
        const eventConstructorMap = this.createEventConstructorMap();
        eventConstructorMap.forEach((eventHandlerConstructorList, eventState) => {
            this.eventMap.set(
                eventState,
                eventHandlerConstructorList.map(eventHandlerConstructor => {
                    return this.eventHandlerFactory.getTargetEventHandler(eventHandlerConstructor);
                })
            );
        });
    }

    /**
     * EventMap을 구성할 생성자 정보를 가지고 있는 map 을 구성합니다.
     *
     * @returns EventMap을 구성할 생성자 정보를 가지고 있는 map
     */
    protected createEventConstructorMap(): EventConstructorMap {
        return new Map([
            [EventState.IDLE, []],
            [EventState.GRAPHIC_INSERT, []],
            [EventState.GRAPHIC_MOVE, []],
            [EventState.GRAPHIC_RESIZE, []],
            [EventState.GRAPHIC_ROTATE, []],
        ]);
    }

    /**
     * eventState에 맞는 eventHandlerList를 반환합니다.
     *
     * @param eventState 현재 app의 eventState
     * @returns eventState에 맞는 eventHandlerList
     */
    @boundMethod
    public get(eventState: EventState): Nullable<EventHandler[]> {
        return this.eventMap.get(eventState);
    }
}

export default EventMapper;
