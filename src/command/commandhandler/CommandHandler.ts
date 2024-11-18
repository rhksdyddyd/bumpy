import AppContext from 'store/context/AppContext';
import { CommandProps } from 'type/BasicTypes';
import Identifiable from 'util/common/Identifiable';

/**
 * process 함수에서의 동작에 대한 결과를 표시하는 interface입니다.
 */
export interface CommandHandlerResponse {
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
 * Command 정보를 를 받아 실제 동작을 처리하는 class 입니다.
 */
abstract class CommandHandler {
    /**
     * 실제 command handler내부에서 동작을 수행하는 부분입니다.
     *
     * @param props command 를 수행하는 데 필요한 정보를 담고 있는 CommandProps
     * @param ctx 현재 app의 상태를 담고있는 AppContext
     * @returns command 수행 결과에 따른 CommandHandlerResponse
     */
    public abstract processCommand(commandProps: CommandProps, ctx: AppContext): CommandHandlerResponse;
}

export default abstract class extends Identifiable(CommandHandler) {}
