import { useState } from 'react';

/**
 * useReRender 의 type을 정의합니다.
 */
type UseRerenderHook = () => {
  triggerRerender: () => void;
};

/**
 * useRerender 를 반환합니다.
 *
 * @returns Rerender를 trigger 할 수 있는 함수를 반환합니다.
 */
const useRerender: UseRerenderHook = () => {
  const [, setValue] = useState<boolean>(false);

  return {
    triggerRerender: () => {
      setValue(prev => !prev);
    },
  };
};

export default useRerender;
