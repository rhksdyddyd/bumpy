import { boundMethod } from 'autobind-decorator';
import CommandEnum from 'command/CommandEnum';
import CommandHandler from 'command/commandhandler/CommandHandler';

/**
 * 특정 command에 대한 필요한 command handler 묶음을 관리하는 map type 입니다.
 */
export type CommandMapType = Map<CommandEnum, CommandHandler[]>;

/**
 * CommandHandlerMap을 동적으로 구성하기 위한 함수를 담고 있는 map type입니다.
 */
export type CommandCreatorMapType = Map<CommandEnum, () => void>;

/**
 * CommandMapper 는 command ID 에 따라 어떤 command handler 들이 동작하는지를 정의한 Abstract Class 입니다.
 * Command manager 가 command ID 를 받으면 command mapper 에서 command handler list 를 받을 수 있습니다.
 * @template T : CommandPropsType
 * @template D : DocumentContextType
 */
export default abstract class CommandMapper {
    /**
     * CommandMap을 반환합니다.
     */
    protected abstract getCommandMap(): CommandMapType;

    /**
     * command creator map을 반환합니다.
     */
    protected abstract getCommandCreatorMap(): CommandCreatorMapType;

    /**
     * Command 에 따른 command handler list 를 반환합니다.
     * command handler list 가 구성되어 있지 않은 경우
     * CommandCreatorMapType를 이용하여 동적으로 생성 후 반환합니다.
     *
     * @param commandID Command handler list 를 찾기 위한 key
     * @returns Command에 해당하는 command handler list
     */
    @boundMethod
    public get(commandID: CommandEnum): Nullable<CommandHandler[]> {
        if (this.getCommandMap().has(commandID) === false) {
            this.getCommandCreatorMap().get(commandID)?.();
        }

        return this.getCommandMap().get(commandID);
    }
}
