import { ResourceEnum } from 'types/resource/ResourceEnum';
import { IControlInfo } from 'types/component/frame/control/ControlTypes';
import { ToolTipEnum } from 'types/tooltip/ToolTipEnum';
import { CommandEnum } from 'types/store/command/CommandEnum';
import { ControlTypeEnum } from 'types/component/frame/control/ControlTypeEnum';
import { ReactKeyEnum } from 'types/resource/ReactKeyEnum';
import { ShapeTypeEnum } from 'types/model/node/graphic/ShapeTypeEnum';
import { ControlSubTypeEnum } from 'types/component/frame/control/ControlSubTypeEnum';

export const RibbonData: IControlInfo[] = new Array(
  {
    type: ControlTypeEnum.RIBBON_GROUP,
    attr: {
      reactKey: ReactKeyEnum.RIBBON_GROUP_INSERT_SHAPE,
      subType: ControlSubTypeEnum.RG1,
      label: ResourceEnum.TXT_GROUP_INSERT_SHAPE,
    },
    subControlInfos: [
      {
        type: ControlTypeEnum.RIBBON_GALLERY,
        attr: {
          reactKey: ReactKeyEnum.RIBBON_GALLERY_INSERT_SHAPE,
          subType: ControlSubTypeEnum.GA1,
          commandId: CommandEnum.SHAPE_INSERT_GALLERY,
        },
      },
    ],
  }
  // {
  //     type: ControlTypeEnum.GROUP,
  //     attr: {
  //         type: 'ANY',
  //         label: ResourceEnum.DEFAULT,
  //     },
  //     items: [],
  // }
);

interface IShapeGalleryGroup {
  reactKey: ReactKeyEnum;
  label: ResourceEnum;
  items: IShapeGalleryItem[];
}

interface IShapeGalleryItem {
  reactKey: ReactKeyEnum;
  img: ResourceEnum;
  shapeType: ShapeTypeEnum;
  tooltipId?: ToolTipEnum;
}

export const ShapeGalleryData: IShapeGalleryGroup[] = [
  {
    reactKey: ReactKeyEnum.RIBBON_GALLERY_INSERT_SHAPE_GROUP_RECT,
    label: ResourceEnum.TXT_SHAPE_INSERT_GALLERY_RECT,
    items: [
      {
        reactKey: ReactKeyEnum.RIBBON_GALLERY_INSERT_SHAPE_GROUP_RECT_ITEM_RECT,
        img: ResourceEnum.IMG_INSERT_SHAPE_RECT,
        shapeType: ShapeTypeEnum.RECT,
      },
      {
        reactKey: ReactKeyEnum.RIBBON_GALLERY_INSERT_SHAPE_GROUP_RECT_ITEM_DIAGONAL_RECT,
        img: ResourceEnum.IMG_INSERT_SHAPE_DIAGONAL_RECT,
        shapeType: ShapeTypeEnum.DIAGONAL_RECT,
      },
    ],
  },
];
