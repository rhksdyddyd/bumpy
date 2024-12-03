import { useState } from 'react';
import { IControlInfo } from 'types/component/frame/control/ControlTypes';

/**
 * useRibbonGallery의 인자를 정의한 interface 입니다.
 *
 * controlInfos: ribbon gallery 내부에 표시 할 수 있는 control의 전체 정보\
 * maxCount: 한번에 표시할 수 있는 control의 최대 갯수
 */
interface UseRibbonGalleryProps {
  controlInfos: IControlInfo[];
  maxCount: number;
}

/**
 * useRibbonGallery의 hook으로서의 type 정의입니다.
 *
 * input ->\
 * controlInfos: ribbon gallery 내부에 표시 할 수 있는 control의 전체 정보\
 * maxCount: 한번에 표시할 수 있는 control의 최대 갯수
 *
 * output ->\
 * handleArrowUpButtonClick: up button을 눌렀을 때의 동작\
 * handleArrowDownButtonClick: down button을 눌렀을 때의 동작\
 * disableUpButton: up button의 활성화 여부\
 * disableDownButton: down button의 활성화 여부\
 * displayedControlInfos: 현재 표시되어야 할 control의 정보\
 * currentIndex: 현재 표시되는 control의 index 정보
 */
type Hook = (props: UseRibbonGalleryProps) => {
  handleArrowUpButtonClick(): void;
  handleArrowDownButtonClick(): void;
  disableUpButton: boolean;
  disableDownButton: boolean;
  displayedControlInfos: IControlInfo[];
  currentIndex: number;
};

/**
 * ribbon gallery 내부에 표시되어야 하는 control과 관련된 연산을 하는 hook 입니다.
 *
 * @param UseRibbonGalleryProps
 * controlInfos: ribbon gallery 내부에 표시 할 수 있는 control의 전체 정보\
 * maxCount: 한번에 표시할 수 있는 control의 최대 갯수
 * @returns
 * handleArrowUpButtonClick: up button을 눌렀을 때의 동작\
 * handleArrowDownButtonClick: down button을 눌렀을 때의 동작\
 * disableUpButton: up button의 활성화 여부\
 * disableDownButton: down button의 활성화 여부\
 * displayedControlInfos: 현재 표시되어야 할 control의 정보\
 * currentIndex: 현재 표시되는 control의 index 정보
 */
const useRibbonGallery: Hook = ({ controlInfos, maxCount }: UseRibbonGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const disableUpButton = currentIndex === 0;
  const disableDownButton = Math.ceil(controlInfos.length / maxCount) - 1 <= currentIndex;

  const displayedControlInfos = controlInfos.flatMap((controlInfo: IControlInfo, index: number) => {
    return index >= currentIndex * maxCount && index < (currentIndex + 1) * maxCount
      ? controlInfo
      : [];
  });

  const handleArrowUpButtonClick = () => {
    if (disableUpButton) {
      return;
    }
    setCurrentIndex(prev => prev - 1);
  };

  const handleArrowDownButtonClick = () => {
    if (disableDownButton) {
      return;
    }
    setCurrentIndex(prev => prev + 1);
  };

  return {
    handleArrowUpButtonClick,
    handleArrowDownButtonClick,
    disableUpButton,
    disableDownButton,
    displayedControlInfos,
    currentIndex,
  };
};

export default useRibbonGallery;
