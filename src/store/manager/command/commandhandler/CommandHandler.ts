import AppContext from 'store/context/AppContext';
import { ICommandHandlerResponse, ICommandProps } from 'types/store/command/CommandTypes';
import Identifiable from 'util/id/Identifiable';

/**
 * Command 정보를 를 받아 실제 동작을 처리하는 class 입니다.
 */
abstract class CommandHandler {
  /**
   * CommandHandler내부에서 실제 동작을 수행하는 부분입니다.
   *
   * @param props command 를 수행하는 데 필요한 정보를 담고 있는 CommandProps
   * @param ctx 현재 app의 상태를 담고있는 AppContext
   * @returns command 수행 결과에 따른 CommandHandlerResponse
   */
  public abstract processCommand(
    commandProps: ICommandProps,
    ctx: AppContext
  ): ICommandHandlerResponse;
}

export default abstract class extends Identifiable(CommandHandler) {}
