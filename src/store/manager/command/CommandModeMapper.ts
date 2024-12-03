import { boundMethod } from 'autobind-decorator';
import CommandHandlerFactory from 'store/manager/command/commandhandler/factory/CommandHandlerFactory';
import CommandMapper from 'store/manager/command/CommandMapper/CommandMapper';
import EditModeCommandMapper from 'store/manager/command/CommandMapper/EditModeCommandMapper';
import { CommandModeEnum } from 'types/store/command/CommandModeEnum';
import { CommandModeMapType } from 'types/store/command/CommandTypes';

/**
 * CommandMode에 따른 CommandMapper를 관리하는 class 입니다.
 */
export default class CommandModeMapper {
  /**
   * command mode에 따른 command mapper를 관리하는 map 입니다.
   */
  private readonly commandModeMap: CommandModeMapType;

  /**
   * command handler를 생성하는 factory 입니다.
   */
  private readonly commandHandlerFactory: CommandHandlerFactory;

  /**
   * 생성자
   */
  public constructor() {
    this.commandModeMap = new Map();
    this.commandHandlerFactory = new CommandHandlerFactory();
    this.init();
  }

  /**
   * command mode에 맞는 commandMapper를 반환합니다.
   *
   * @param commandMode 현재 실행중인 commandMode
   * @returns command mode에 맞는 commandMapper
   */
  @boundMethod
  public get(commandMode: CommandModeEnum): Nullable<CommandMapper> {
    return this.commandModeMap.get(commandMode);
  }

  /**
   * commandModeMap을 초기화 합니다.
   */
  @boundMethod
  private init() {
    this.commandModeMap.set(
      CommandModeEnum.EDIT,
      new EditModeCommandMapper(this.commandHandlerFactory)
    );
  }
}
