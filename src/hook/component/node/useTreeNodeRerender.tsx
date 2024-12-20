import { useEffect } from 'react';
import { TreeNodeComponentProps } from 'types/component/node/factory/TreeNodeFactoryComponentTypes';
import useRerender from 'hook/store/useRerender';

type Hook = (props: TreeNodeComponentProps) => void;

const useTreeNodeRerender: Hook = (props: TreeNodeComponentProps) => {
  const { triggerRerender } = useRerender();

  const { model } = props;

  useEffect(() => {
    model.setRerenderTrigger(triggerRerender);

    return () => {
      model.setRerenderTrigger(undefined);
    };
  }, []);
};

export default useTreeNodeRerender;
