import { boundMethod } from 'autobind-decorator';
import CommandEnum from 'command/CommandEnum';
import CommandHandlerFactory from 'command/commandhandler/factory/CommandHandlerFactory';
import GraphicInsertCommandHandler from 'command/commandhandler/graphic/GraphiclnsertCommandHandler';
import CommandMapper, { CommandCreatorMapType, CommandMapType } from 'command/CommandMapper/CommandMapper';

/**
 * 편집 모드 (Edit) 인 경우에 대한 command mapper 입니다.
 */
class EditModeCommandMapper extends CommandMapper {
    /**
     * 특정 command에 대한 필요한 command handler 묶음을 관리하는 map 입니다.
     */
    protected readonly commandMap: CommandMapType;

    /**
     * CommandHandlerMap을 동적으로 구성하기 위한 함수를 담고 있는 map 입니다.
     */
    protected readonly commandCreatorMap: CommandCreatorMapType;

    /**
     * 생성자
     *
     * @param commandHandlerFactory command handler를 생성할 수 있는 factory 입니다.
     */
    public constructor(commandHandlerFactory: CommandHandlerFactory) {
        super();
        this.commandMap = new Map();
        this.commandCreatorMap = new Map();
        this.init(commandHandlerFactory);
    }

    /**
     * CommandMap을 반환합니다.
     *
     * @returns this.commandMap
     */
    @boundMethod
    public getCommandMap(): CommandMapType {
        return this.commandMap;
    }

    /**
     * command creator map을 반환합니다.
     *
     * @returns this.commandCreatorMap
     */
    public getCommandCreatorMap(): CommandCreatorMapType {
        return this.commandCreatorMap;
    }

    /**
     * command handler를 동적으로 생성 할 수 있도록 CommandCreatorMap을 채웁니다.
     *
     * @param commandHandlerFactory command handler를 생성할 수 있는 factory 입니다.
     */
    @boundMethod
    private init(commandHandlerFactory: CommandHandlerFactory): void {
        this.getCommandCreatorMap().set(CommandEnum.GRAPHIC_INSERT_SET_UP, () => {
            const graphicInsertCommandHandler =
                commandHandlerFactory.getTargetCommandHandler(GraphicInsertCommandHandler);
            this.getCommandMap().set(CommandEnum.GRAPHIC_INSERT_SET_UP, [graphicInsertCommandHandler]);
        });
    }
}

export default EditModeCommandMapper;
