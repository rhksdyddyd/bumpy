import EventHandler from 'store/manager/event/handler/EventHandler';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import { UniqueKey } from 'util/id/Identifiable';

/**
 * EventState에 따라 eventHandlerList를 관리하는 map type입니다.
 */
export type EventMap = Map<EventStateEnum, EventHandler[]>;

/**
 * EventMap을 구성할 생성자 정보를 가지고 있는 map type입니다.
 */
export type EventConstructorMap = Map<EventStateEnum, (new () => EventHandler)[]>;

/**
 * EventHandler의 instance를 관리하는 Map type 입니다.
 */
export type EventHandlerMap = Map<UniqueKey, EventHandler>;
