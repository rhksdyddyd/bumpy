import { boundMethod } from 'autobind-decorator';
import CommandCompositor from 'command/CommandCompositor';
import CommandController from 'command/CommandController';
import CommandEnum from 'command/CommandEnum';
import CommandMapper from 'command/CommandMapper/CommandMapper';
import CommandModeMapper from 'command/CommandModeMapper';
import AppContext from 'store/context/AppContext';
import { CommandProps } from 'type/BasicTypes';

/**
 * Command 수행을 담당하는 class 입니다.
 * 실제 tree node에 대한 변경사항의 반영은 Command manager 안에서만 가능합니다.
 */
export default class CommandManager {
    /**
     * 현재 실행 상황(command mode)에 대한 CommandMapper List를 가지고 있는 Mapper 입니다.
     */
    private commandModeMapper: CommandModeMapper;

    /**
     * 생성자
     */
    public constructor() {
        this.commandModeMapper = new CommandModeMapper();
    }

    /**
     * command를 실행하기 위한 command handler 정보를 담고 있는 command mapper을 반환합니다.
     *
     * @param ctx 현재 app의 상태를 담고 있는 AppContext
     * @returns command mode에 따른 command mapper
     */
    @boundMethod
    private getCommandMapper(ctx: AppContext): Nullable<CommandMapper> {
        return this.commandModeMapper.get(ctx.getEditableContext().getCommandMode());
    }

    /**
     * command compositor를 생성하여 반환합니다.
     *
     * @param ctx 현재 app의 정보를 담고 있는 AppContext
     * @returns 새로 생성 한 CommandCompositor
     */
    private createCommandCompositor(ctx: AppContext): CommandCompositor {
        return new CommandCompositor(ctx);
    }

    /**
     * command controller를 생성하여 반환합니다.
     *
     * @param commandCompositor CommandController 생성에 필요한 command compositor
     * @returns 새로 생성 한 CommandController
     */
    private createCommandController(commandCompositor: CommandCompositor): CommandController {
        return new CommandController(commandCompositor);
    }

    /**
     * CommandID를 기준으로 command를 구성하고 실행합니다.
     *
     * @param ctx 현재 app의 상태를 담고 있는 AppContext
     * @returns command 가 정상적으로 실행 되었는지의 여부
     */
    @boundMethod
    public execute(ctx: AppContext): boolean {
        const editableContext = ctx.getEditableContext();
        const commandProps = editableContext.getCommandProps();
        if (commandProps === undefined) {
            return false;
        }

        const commandID = commandProps.commandID;
        if (commandID === CommandEnum.UNDO) {
            return this.executeUndo(ctx, commandProps);
        } else if (commandID === CommandEnum.REDO) {
            return this.executeRedo(ctx, commandProps);
        } else {
            return this.executeCurrentCommand(ctx, commandProps);
        }
    }

    /**
     * 현재 입력에 맞추어 command 를 실행합니다.
     *
     * @param ctx 현재 app의 상태를 담고 있는 AppContext
     * @param commandProps command 실행 정보를 담고 있는 CommandProps
     * @returns 정상적으로 command 가 실행되었는지의 여부
     */
    @boundMethod
    private executeCurrentCommand(ctx: AppContext, commandProps: CommandProps): boolean {
        const editableContext = ctx.getEditableContext();
        // compose simple commands
        const commandController = this.createCommandController(this.createCommandCompositor(ctx));
        editableContext.setCommandController(commandController);

        let isCommandValid = true;

        this.getCommandMapper(ctx)
            ?.get(commandProps.commandID)
            ?.some(commandHandler => {
                if (isCommandValid === false) {
                    return true;
                }

                // simple command 를 CommandController 통해서 CommandCompositor 에 append 하는 과정
                const response = commandHandler.processCommand(commandProps, ctx);
                if (response.isValid === false) {
                    isCommandValid = false;
                    commandController.fallback();
                    return true;
                }

                return response.terminate;
            });

        if (isCommandValid === true) {
            commandController.executeCommand();
            commandController.executePostCommand();
            commandController.finishApplyProcess(ctx);

            return true;
        }

        return false;
    }

    /**
     * 현재 입력에 맞추어 Undo 를 실행합니다.
     *
     * @param ctx 현재 app의 상태를 담고 있는 AppContext
     * @param commandProps command 실행 정보를 담고 있는 CommandProps
     * @returns 정상적으로 command 가 실행되었는지의 여부
     */
    @boundMethod
    private executeUndo(ctx: AppContext, commandProps: CommandProps): boolean {
        const editableContext = ctx.getEditableContext();
        // compose simple commands
        const commandController = this.createCommandController(this.createCommandCompositor(ctx));
        commandController.unExecuteCommand(ctx);
        return true;
    }

    /**
     * 현재 입력에 맞추어 Redo 를 실행합니다.
     *
     * @param ctx 현재 app의 상태를 담고 있는 AppContext
     * @param commandProps command 실행 정보를 담고 있는 CommandProps
     * @returns 정상적으로 command 가 실행되었는지의 여부
     */
    @boundMethod
    private executeRedo(ctx: AppContext, commandProps: CommandProps): boolean {
        const editableContext = ctx.getEditableContext();
        // compose simple commands
        const commandController = this.createCommandController(this.createCommandCompositor(ctx));
        commandController.reExecuteCommand(ctx);
        return true;
    }
}
