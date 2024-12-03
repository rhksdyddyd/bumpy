import RibbonGalleryItemComponent from 'component/frame/control/gallery/RibbonGalleryItemComponent';
import useRibbonGallery from 'hook/component/frame/control/gallery/useRibbonGallery';
import React from 'react';
import { ShapeGalleryData } from 'resource/ribbon/RibbonData';
import AppStore from 'store/AppStore';
import { ControlTypeEnum } from 'types/component/frame/control/ControlTypeEnum';
import { IControlAttr, IControlInfo } from 'types/component/frame/control/ControlTypes';
import {
  IDropdownMenuInfo,
  IDropdownMenuItemGroupInfo,
} from 'types/component/frame/control/dropdown/menu/DropdownMenuTypes';
import { IRibbonGalleryProps } from 'types/component/frame/control/gallery/RibbonGalleryTypes';
import { ShapeTypeEnum } from 'types/model/node/graphic/ShapeTypeEnum';
import { ResourceEnum } from 'types/resource/ResourceEnum';
import { CommandEnum } from 'types/store/command/CommandEnum';

import dropdownMenuStyles from 'scss/component/frame/control/dropdown/menu/DropdownMenu.module.scss';
import dropdownMenuItemGroupStyles from 'scss/component/frame/control/dropdown/menu/DropdownMenuItemGroup.module.scss';

/**
 * ShapeInsertGallery에 해당하는 ControlHandler 입니다.
 * 내부 control 및 dropdown을 구성합니다.
 *
 * @param commandId 실행 할 commandId
 * @param appStore 현재 app의 정보를 담고 있는 AppStore
 * @param attr control의 세부 정보
 * @returns 새롭게 구성 한 ControlProps
 */
export default function ShapeInsertGalleryHandler(
  commandId: CommandEnum,
  appStore: AppStore,
  attr: IControlAttr
): IRibbonGalleryProps {
  const galleryItemMap = new Map<ResourceEnum, IControlInfo[]>();

  ShapeGalleryData.forEach(shapeGalleryGroup => {
    const galleryItemList: Array<IControlInfo> = [];
    galleryItemMap.set(shapeGalleryGroup.label, galleryItemList);
    shapeGalleryGroup.items.forEach(shapeGalleryItem => {
      galleryItemList.push({
        type: ControlTypeEnum.RIBBON_GALLERY_ITEM,
        attr: {
          reactKey: shapeGalleryItem.reactKey,
          commandId: CommandEnum.SHAPE_INSERT_GALLERY_ITEM,
          img: shapeGalleryItem.img,
          subType: shapeGalleryItem.shapeType,
        },
      });
    });
  });

  const controlInfos = Array.from(galleryItemMap.values()).reduce((acc, curr) => {
    return acc.concat(curr);
  }, []);

  const columnNum = 6;
  const rowNum = 3;

  const {
    handleArrowUpButtonClick,
    handleArrowDownButtonClick,
    disableUpButton,
    disableDownButton,
    displayedControlInfos,
    currentIndex,
  } = useRibbonGallery({
    controlInfos,
    maxCount: columnNum * rowNum,
  });

  const onClick = (shapeType: ShapeTypeEnum): void => {
    const commandProps = {
      commandId: CommandEnum.GRAPHIC_INSERT_SET_UP,
      shapeType,
    };

    appStore.handleCommandEvent(commandProps);
  };

  const dropdownMenuInfo: IDropdownMenuInfo = createShapeDummyGalleryDropdown(
    galleryItemMap,
    onClick
  );

  return {
    attr: {
      reactKey: attr.reactKey,
      disableUpButton,
      disableDownButton,
      dropdownMenuInfo,
    },
    subControlInfos: displayedControlInfos,
    eventhandler: {
      onArrowUpButtonClick: handleArrowUpButtonClick,
      onArrowDownButtonClick: handleArrowDownButtonClick,
    },
  };
}

/**
 * ShapeInsertGallery의 dropdown을 구성하여 반환합니다.
 *
 * @param galleryItemMap gallery를 구성하는 item의 map
 * @param onClick menu의 내부 item을 클릭했을 때 수행 할 동작
 * @returns 새롭게 구성 한 DropdownMenuInfo
 */
function createShapeDummyGalleryDropdown(
  galleryItemMap: Map<ResourceEnum, IControlInfo[]>,
  onClick: (shapeType: ShapeTypeEnum) => void
): IDropdownMenuInfo {
  const menuInfo: IDropdownMenuInfo = {
    className: dropdownMenuStyles.shape_insert_gallery,
    dropdownMenuSubItemInfos: [],
  };
  galleryItemMap.forEach((controlInfoList: IControlInfo[], label: ResourceEnum) => {
    for (let i = 0; i < 10; i += 1) {
      const groupInfo: IDropdownMenuItemGroupInfo = {
        className: dropdownMenuItemGroupStyles.shape_insert_gallery,
        type: 'group',
        dropdownMenuSubItemInfos: [],
      };
      for (let j = 0; j < 30; j += 1) {
        controlInfoList.forEach(item => {
          groupInfo.dropdownMenuSubItemInfos.push({
            type: 'item',
            subType: 'a1',
            selected: false,
            children: (
              <RibbonGalleryItemComponent
                attr={{
                  reactKey: item.attr.reactKey,
                  img: item.attr.img,
                }}
                eventhandler={{
                  onClick() {
                    onClick(item.attr.subType as ShapeTypeEnum);
                  },
                }}
              />
            ),
            label: item.attr.label,
          });
        });
      }

      menuInfo.dropdownMenuSubItemInfos.push(
        {
          type: 'title',
          label,
        },
        groupInfo
      );
    }
  });
  return menuInfo;
}
