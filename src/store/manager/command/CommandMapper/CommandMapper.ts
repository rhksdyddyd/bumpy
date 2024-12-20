import { boundMethod } from 'autobind-decorator';
import CommandHandler from 'store/manager/command/commandhandler/CommandHandler';
import { CommandEnum } from 'types/store/command/CommandEnum';
import { CommandCreatorMapType, CommandMapType } from 'types/store/command/CommandTypes';

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
