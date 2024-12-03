import AppStore from 'store/AppStore';
import { IControlAttr, IControlProps } from 'types/component/frame/control/ControlTypes';
import { ShapeTypeEnum } from 'types/model/node/graphic/ShapeTypeEnum';
import { CommandEnum } from 'types/store/command/CommandEnum';

/**
 * ShapeInsertGallery의 내부 item에 해당하는 ControlHandler 입니다.
 *
 * @param commandId 실행 할 commandId
 * @param appStore 현재 app의 정보를 담고 있는 AppStore
 * @param attr control의 세부 정보
 * @returns 새롭게 구성 한 ControlProps
 */
export default function ShapeInsertGalleryItemHandler(
  commandId: CommandEnum,
  appStore: AppStore,
  attr: IControlAttr
): IControlProps {
  return {
    attr: { reactKey: attr.reactKey },
    eventhandler: {
      onClick: () => {
        const commandProps = {
          commandId: CommandEnum.GRAPHIC_INSERT_SET_UP,
          shapeType: attr.subType as ShapeTypeEnum,
        };

        appStore.handleCommandEvent(commandProps);
      },
    },
  };
}
