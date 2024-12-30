import React, { useEffect, useMemo, useRef } from 'react';
import TreeNodeFactoryComponent from 'component/node/factory/TreeNodeFactoryComponent';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';

type Hook = (props: TreeNodeComponentProps) => {
  renderedChildren: React.JSX.Element;
};

const useRenderChildren: Hook = (props: TreeNodeComponentProps) => {
  const rerenderChildrenRef = useRef<number>(0);

  const { model, zoomRatio } = props;

  useEffect(() => {
    model.setRerenderChildrenRef(rerenderChildrenRef);

    return () => {
      model.setRerenderChildrenRef(undefined);
    };
  }, []);

  const renderedChildren = (
    <>
      {model.mapChild(child => {
        return (
          <TreeNodeFactoryComponent key={`tree_node_${child.getId()}`} {...props} model={child} />
        );
      })}
    </>
  );

  // const renderedChildren = useMemo(() => {
  //   return (
  //     <>
  //       {model.mapChild(child => {
  //         return (
  //           <TreeNodeFactoryComponent key={`tree_node_${child.getId()}`} {...props} model={child} />
  //         );
  //       })}
  //     </>
  //   );
  // }, [rerenderChildrenRef.current, zoomRatio]);

  return { renderedChildren };
};

export default useRenderChildren;
