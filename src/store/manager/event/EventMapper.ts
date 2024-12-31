import { boundMethod } from 'autobind-decorator';
import EventHandlerFactory from 'store/manager/event/EventHandlerFactory';
import EventHandler from 'store/manager/event/handler/EventHandler';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import { EventConstructorMap, EventMap } from 'types/store/event/EventTypes';
import GraphicInsertEventHandler from './handler/graphic/GraphicInsertEventHandler';
import GraphicEventHandler from './handler/graphic/GraphicEventHandler';
import GraphicSelectionEventHandler from './handler/graphic/GraphicSelectionEventHandler';
import GraphicMoveEventHandler from './handler/graphic/GraphicMoveEventHandler';

/**
 * EventState 에 따라 어떤 event handler 들이 순서대로 동작하는 지를 관리합니다.
 */
export default class EventMapper {
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
      [EventStateEnum.IDLE, [GraphicEventHandler]],
      [EventStateEnum.GRAPHIC_INSERT, [GraphicInsertEventHandler]],
      [EventStateEnum.GRAPHIC_MOVE, [GraphicSelectionEventHandler, GraphicMoveEventHandler]],
      [EventStateEnum.GRAPHIC_RESIZE, []],
      [EventStateEnum.GRAPHIC_ROTATE, []],
    ]);
  }

  /**
   * eventState에 맞는 eventHandlerList를 반환합니다.
   *
   * @param eventState 현재 app의 eventState
   * @returns eventState에 맞는 eventHandlerList
   */
  @boundMethod
  public get(eventState: EventStateEnum): Nullable<EventHandler[]> {
    return this.eventMap.get(eventState);
  }
}
