import { boundMethod } from 'autobind-decorator';
import CommandHandler from 'store/manager/command/commandhandler/CommandHandler';
import { identify, UniqueKey } from 'util/id/Identifiable';

/**
 * CommandHandler의 instance를 관리하는 map type 입니다.
 */
export type CommandHandlerMapType = Map<UniqueKey, CommandHandler>;

/**
 * CommandHandler 를 생성하는 factory 입니다.
 */
export default class CommandHandlerFactory {
  /**
   * CommandHandler의 instance를 관리하는 map 입니다.
   */
  private readonly commandHandlerMap: CommandHandlerMapType;

  /**
   * 생성자
   */
  public constructor() {
    this.commandHandlerMap = new Map();
  }

  /**
   * 원하는 종류의 CommandHandler를 반환합니다.
   *
   * @param commandHandlerEnum 요청하는 CommandHandler의 type
   * @returns 요청한 CommandHandler의 instance
   */
  @boundMethod
  public getTargetCommandHandler(
    CommandHandlerConstructor: new () => CommandHandler
  ): CommandHandler {
    const uniqueKey = identify(CommandHandlerConstructor);
    let commandHandler = this.commandHandlerMap.get(uniqueKey);
    if (commandHandler === undefined) {
      commandHandler = new CommandHandlerConstructor();
      this.commandHandlerMap.set(uniqueKey, commandHandler);
    }

    return commandHandler;
  }
}
