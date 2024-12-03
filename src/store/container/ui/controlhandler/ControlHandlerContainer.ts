import { boundMethod } from 'autobind-decorator';
import AppStore from 'store/AppStore';
import ShapeInsertGalleryHandler from 'store/container/ui/controlhandler/handler/ShapeInsertGalleryHandler';
import ShapeInsertGalleryItemHandler from 'store/container/ui/controlhandler/handler/ShapeInsertGalleryItemHandler';
import { ControlHandlerMapType } from 'types/component/frame/contolhandler/WithControlHandlerTypes';
import {
  IControlAttr,
  IControlEvent,
  IControlInfo,
  IControlProps,
  ICustomControlProps,
} from 'types/component/frame/control/ControlTypes';
import { CommandEnum } from 'types/store/command/CommandEnum';

/**
 * ControlInfo를 분석하여 추가 정보를 제공하는 ControlHandler를 관리하고 적용하는 역할을 합니다.
 */
export default class ControlHandlerContainer {
  /**
   * ControlHandler를 관리하는 map 입니다.
   */
  private readonly controlHandlerMap: ControlHandlerMapType;

  /**
   * 생성자
   */
  public constructor() {
    this.controlHandlerMap = this.initControlHandlerMap();
  }

  /**
   * ControlHandlerMap을 초기화 합니다.
   *
   * @returns 새로 생성한 ControlHandlerMap
   */
  @boundMethod
  private initControlHandlerMap(): ControlHandlerMapType {
    return new Map([
      [CommandEnum.SHAPE_INSERT_GALLERY, ShapeInsertGalleryHandler],
      [CommandEnum.SHAPE_INSERT_GALLERY_ITEM, ShapeInsertGalleryItemHandler],
    ]);
  }

  /**
   * CommandId에 맞는 ControlHandler를 찾아 controlInfo를 해석하여 적절한 ControlProps를 반환합니다.
   *
   * @param controlInfo controlInfo
   * @param appStore 현재 app의 정보를 담고있는 AppStore
   * @returns 새롭게 생성한 ControlProps
   */
  @boundMethod
  public getHandledControlProps(
    controlInfo: IControlInfo,
    appStore: AppStore
  ): IControlProps | ICustomControlProps<IControlAttr, IControlEvent> {
    const handler = this.controlHandlerMap.get(controlInfo.attr.commandId as CommandEnum);
    if (handler !== undefined) {
      return handler(
        controlInfo.attr.commandId as CommandEnum,
        appStore,
        controlInfo.attr,
        controlInfo.subControlInfos
      );
    }
    return this.defaultControlHandler(controlInfo, appStore);
  }

  /**
   * custom control handler가 없는 경우 기본으로 처리 할 control handler 입니다.
   *
   * @param controlInfo controlInfo
   * @param appStore 현재 app의 정보를 담고있는 AppStore
   * @returns 새롭게 생성한 ControlProps
   */
  @boundMethod
  private defaultControlHandler(controlInfo: IControlInfo, appStore: AppStore): IControlProps {
    const commandId = controlInfo.attr.commandId as CommandEnum;
    return {
      attr: { reactKey: controlInfo.attr.reactKey },
      eventhandler: {
        onClick: () => {
          appStore.handleCommandEvent({ commandId });
        },
      },
    };
  }
}
