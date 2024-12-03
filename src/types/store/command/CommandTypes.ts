import CommandMapper from 'store/manager/command/CommandMapper/CommandMapper';
import { CommandModeEnum } from 'types/store/command/CommandModeEnum';

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
