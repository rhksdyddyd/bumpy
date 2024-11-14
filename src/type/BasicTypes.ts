import CommandEnum from 'command/CommandEnum';
import EventManager from 'event/EventManager';
import EventState from 'event/types/EventState';
import SelectionContainer from 'selection/SelectionContainer';

/**
 * store에서 event를 처리하기 위한 함수의 인자입니다.
 */
export interface ManagerExcutionOptions<T extends keyof EventManager> {
    eventType?: T;
    event?: Parameters<EventManager[T]>[0];
    commandProps?: CommandProps;
    publishMessage?: boolean;
}

/**
 * CommandManager 에 command 를 execute 할 때 지켜야 할 interface 입니다.
 * CommandHandler 는 CommandProps 를 인자로 받아 작업을 처리합니다.
 */
export interface CommandProps {
    commandID: CommandEnum;
    newEventState?: EventState;
    newSelectionContainer?: SelectionContainer;
}

export default null;
