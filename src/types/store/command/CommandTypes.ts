import CommandMapper from 'store/manager/command/CommandMapper/CommandMapper';
import { CommandModeEnum } from 'types/store/command/CommandModeEnum';
import SelectionContainer from 'store/manager/selection/SelectionContainer';
import CommandHandler from 'store/manager/command/commandhandler/CommandHandler';
import { CommandEnum } from './CommandEnum';
import { EventStateEnum } from '../event/EventStateEnum';

/**
 * 특정 command에 대한 필요한 command handler 묶음을 관리하는 map type 입니다.
 */
export type CommandMapType = Map<CommandEnum, CommandHandler[]>;

/**
 * CommandHandlerMap을 동적으로 구성하기 위한 함수를 담고 있는 map type입니다.
 */
export type CommandCreatorMapType = Map<CommandEnum, () => void>;

/**
 * CommandMapper를 관리하기 위한 map type 입니다.
 */
export type CommandModeMapType = Map<CommandModeEnum, CommandMapper>;

/**
 * process 함수에서의 동작에 대한 결과를 표시하는 interface입니다.
 */
export interface ICommandHandlerResponse {
  /**
   * command handler의 실행에 문제가 없었는지 표기합니다.
   * 문제가 없을 경우 true, 있을 경우 false
   */
  isValid: boolean;
  /**
   * command 가 완전히 종결되어 다음 commandHandler chain으로 넘길지 표기합니다.
   * 종결되었을 경우 true, 다음 commandHandler에서 처리해야 할 것이 있을 경우 false
   */
  terminate: boolean;
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
