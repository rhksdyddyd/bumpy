import AppContext from 'store/context/AppContext';
import CommandHandler from 'store/manager/command/commandhandler/CommandHandler';
import { ICommandProps } from 'types/store/BasicTypes';
import { ICommandHandlerResponse } from 'types/store/command/CommandTypes';

/**
 * graphic model을 삽입하는 동작을 수행하는 command handler입니다.
 */
export default class GraphicInsertCommandHandler extends CommandHandler {
  /**
   * 실제 command handler내부에서 동작을 수행하는 부분입니다.
   *
   * @param props command 를 수행하는 데 필요한 정보를 담고 있는 CommandProps
   * @param ctx 현재 app의 상태를 담고있는 AppContext
   * @returns command 수행 결과에 따른 CommandHandlerResponse
   */
  public processCommand(props: ICommandProps, ctx: AppContext): ICommandHandlerResponse {
    switch (props.commandId) {
      default:
        return { isValid: true, terminate: true };
    }
  }
}
