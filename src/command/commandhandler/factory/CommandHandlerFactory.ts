import { boundMethod } from 'autobind-decorator';
import CommandHandler from 'command/commandhandler/CommandHandler';
import GraphicInsertCommandHandler from 'command/commandhandler/graphic/GraphiclnsertCommandHandler';

/**
 * command handler의 생성자를 관리하는 map type 입니다.
 */
type CommandHandlerConstructorMaptype = Map<CommandHandlerEnum, new () => CommandHandler>;

/**
 * command handler의 instance를 관리하는 map type 입니다.
 */
export type CommandHandlerMapType = Map<CommandHandlerEnum, CommandHandler>;

/**
 * command handler의 종류를 나타내는 enum 입니다.
 */
export enum CommandHandlerEnum {
    GRAPHIC_INSERT,
    GRAPHIC_MOVE,
    GRAPHIC_RESIZE,
    GRAPHIC_DELETE,
    GROUP,
}

/**
 * Command handler 를 생성하는 factory 입니다.
 */
export default class CommandHandlerFactory {
    /**
     * command handler의 생성자를 관리하는 map 입니다.
     */
    private readonly commandHandlerConstructorMap: CommandHandlerConstructorMaptype;

    /**
     * command handler의 instance를 관리하는 map 입니다.
     */
    private readonly commandHandlerMap: CommandHandlerMapType;

    /**
     * 생성자
     */
    public constructor() {
        this.commandHandlerConstructorMap = new Map();
        this.commandHandlerMap = new Map();
        this.init();
    }

    /**
     * commandHandlerConstructorMap을 구성합니다.
     */
    @boundMethod
    private init() {
        this.commandHandlerConstructorMap.set(CommandHandlerEnum.GRAPHIC_INSERT, GraphicInsertCommandHandler);
        // this.commandHandlerConstructorMap.push(CommandHandlerEnum.GRAPHIC_DELETE, GraphicDeleteCommandHandler);
        // this.commandHandlerConstructorMap.push(CommandHandlerEnum.GRAPHIC_MOVE, GraphicMoveCommandHandler);
        // this.commandHandlerConstructorMap.push(CommandHandlerEnum.GRAPHIC_RESIZE, GraphicResizeCommandHandler);
        // this.commandHandlerConstructorMap.push(CommandHandlerEnum.GRAPHIC_GROUP, GraphicGroupCommandHandler);
    }

    /**
     * 원하는 종류의 command handler를 반환합니다.
     *
     * @param commandHandlerEnum 요청하는 command handler의 type
     * @returns 요청한 command handler의 instance
     */
    @boundMethod
    public getTargetCommandHandler(commandHandlerEnum: CommandHandlerEnum): CommandHandler {
        let commandHandler = this.commandHandlerMap.get(commandHandlerEnum);

        if (commandHandler === undefined) {
            const constructor = this.commandHandlerConstructorMap.get(commandHandlerEnum);
            if (constructor === undefined) {
                throw Error();
            }
            commandHandler = new constructor();
            this.commandHandlerMap.set(commandHandlerEnum, commandHandler);
        }

        return commandHandler;
    }
}
