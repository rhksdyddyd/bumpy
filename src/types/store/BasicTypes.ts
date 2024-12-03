import EventManager from 'store/manager/event/EventManager';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import { CommandEnum } from 'types/store/command/CommandEnum';
import { EventStateEnum } from 'types/store/event/EventStateEnum';

/**
 * store에서 event를 처리하기 위한 함수의 인자입니다.
 */
export interface IManagerExcutionOptions<T extends keyof EventManager> {
  eventType?: T;
  event?: Parameters<EventManager[T]>[0];
  commandProps?: ICommandProps;
  publishMessage?: boolean;
}

/**
 * CommandManager 에 command 를 execute 할 때 지켜야 할 interface 입니다.
 * CommandHandler 는 CommandProps 를 인자로 받아 작업을 처리합니다.
 */
export interface ICommandProps {
  commandId: CommandEnum;
  newEventState?: EventStateEnum;
  newSelectionContainer?: SelectionContainer;
}
