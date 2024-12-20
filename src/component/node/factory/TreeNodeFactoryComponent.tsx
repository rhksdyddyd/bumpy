import React from 'react';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';
import { identify } from 'util/id/Identifiable';
import { TreeNodeComponentMap } from './TreeNodeComponentMap';

const TreeNodeFactoryComponent = (props: TreeNodeComponentProps): React.JSX.Element => {
  const { model } = props;
  const TargetComponent = TreeNodeComponentMap.get(identify(model.constructor));

  return <>{TargetComponent && <TargetComponent {...props} />}</>;
};

export default TreeNodeFactoryComponent;
