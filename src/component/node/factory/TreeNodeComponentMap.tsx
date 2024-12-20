import SlideModel from 'model/node/slide/SlideModel';
import GraphicModel from 'model/node/graphic/GraphicModel';
import { TreeNodeComponentMapType } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';
import SlideComponent from '../slide/SlideComponent';
import GraphicWrapperComponent from '../graphic/GraphicWrapperComponent';

export const TreeNodeComponentMap: TreeNodeComponentMapType = new Map([
  [SlideModel.getUniqueKey(), SlideComponent],
  [GraphicModel.getUniqueKey(), GraphicWrapperComponent],
]);
