import { boundMethod } from 'autobind-decorator';
import CommandHandler from 'store/manager/command/commandhandler/CommandHandler';
import { CommandEnum } from 'types/store/command/CommandEnum';

/**
 * 특정 command에 대한 필요한 command handler 묶음을 관리하는 map type 입니다.
 */
export type CommandMapType = Map<CommandEnum, CommandHandler[]>;

/**
 * CommandHandlerMap을 동적으로 구성하기 위한 함수를 담고 있는 map type입니다.
 */
export type CommandCreatorMapType = Map<CommandEnum, () => void>;

/**
 * CommandMapper는 commandId 에 따라 어떤 CommandHandler 들이 동작하는지를 정의합니다.
 * CommandManager가 commandId 를 받으면 CommandMapper 에서 CommandHandler의 list 받아 실행합니다.
 */
export default abstract class CommandMapper {
  /**
   * CommandMap을 반환합니다.
   */
  protected abstract getCommandMap(): CommandMapType;

  /**
   * CommandCreatorMap을 반환합니다.
   */
  protected abstract getCommandCreatorMap(): CommandCreatorMapType;

  /**
   * commandId 에 따른 CommandHandler의 list 를 반환합니다.
   * list 가 구성되어 있지 않은 경우 CommandCreatorMap을 이용하여 동적으로 생성 후 반환합니다.
   *
   * @param commandId CommandHandler의 list 를 찾기 위한 key
   * @returns commandId 해당하는 CommandHandler의 list
   */
  @boundMethod
  public get(commandId: CommandEnum): Nullable<CommandHandler[]> {
    if (this.getCommandMap().has(commandId) === false) {
      this.getCommandCreatorMap().get(commandId)?.();
    }

    return this.getCommandMap().get(commandId);
  }
}
