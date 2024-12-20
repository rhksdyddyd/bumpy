import EventManager from 'store/manager/event/EventManager';
import { ICommandProps } from './command/CommandTypes';

/**
 * store에서 event를 처리하기 위한 함수의 인자입니다.
 */
export interface IManagerExcutionOptions<T extends keyof EventManager> {
  eventType?: T;
  event?: Parameters<EventManager[T]>[0];
  commandProps?: ICommandProps;
  publishMessage?: boolean;
}
