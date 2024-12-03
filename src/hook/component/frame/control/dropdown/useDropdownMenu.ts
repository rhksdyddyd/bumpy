import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * useDropdownMenu의 hook으로서의 type 정의입니다.
 *
 * input ->\
 * null
 *
 * output ->\
 * targetRef: dropdownMenu가 부착 될 HTML 요소의 ref 입니다.\
 * menuRef: dropdownMenu의 ref 입니다. 생성하는 dropdownMenu의 HTML 요소에 적용해야 합니다.\
 * isOpen: dropdownMenu가 현지 열려있는지 여부입니다.\
 * openMenu: dropdownMenu를 엽니다.\
 * closeMenu: dropdownMenu를 닫습니다.\
 * toggleMenu: dropdownMenu를 toggle 합니다.
 */
type Hook = () => {
  isOpen: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement>;
};

/**
 * dropdown이 페이지를 넘어가게 되는 경우 scroll을 표시하기 위한 계산 값입니다.
 */
const SCROLLBAR_WIDTH = 16;
const DROPDOWN_MARGIN = 10;

/**
 * dropdownMenu의 표시 동작과 관련 된 연산을 하는 hook 입니다.
 * dropdown이 표시 될 위치와 표시 여부를 처리합니다.
 *
 * @returns
 * targetRef: dropdownMenu가 부착 될 HTML 요소의 ref 입니다.\
 * menuRef: dropdownMenu의 ref 입니다. 생성하는 dropdownMenu의 HTML 요소에 적용해야 합니다.\
 * isOpen: dropdownMenu가 현지 열려있는지 여부입니다.\
 * openMenu: dropdownMenu를 엽니다.\
 * closeMenu: dropdownMenu를 닫습니다.\
 * toggleMenu: dropdownMenu를 toggle 합니다.
 */
const useDropdownMenu: Hook = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * DropdownMenu, DropdownButton 외 영역 클릭 시 Menu 를 닫음
   */
  const closeOnClickOutside = useCallback((e: MouseEvent) => {
    const eventTarget = e.target;
    // eslint-disable-next-line no-restricted-syntax
    if (eventTarget instanceof Element && menuRef.current?.contains(eventTarget)) {
      return;
    }
    // eslint-disable-next-line no-restricted-syntax
    if (eventTarget instanceof HTMLInputElement && targetRef.current?.contains(eventTarget)) {
      return;
    }
    e.stopPropagation();
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', closeOnClickOutside, true);
    } else {
      document.removeEventListener('click', closeOnClickOutside, true);
    }
    return () => {
      document.removeEventListener('click', closeOnClickOutside, true);
    };
  }, [isOpen]);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!targetRef.current || !menuRef.current) {
      return;
    }

    menuRef.current.style.height = 'auto';

    const {
      left: targetLeft,
      bottom: targetBottom,
      width: targetWidth,
    } = targetRef.current.getBoundingClientRect();
    const { width: menuWidth, height: menuHeight } = menuRef.current.getBoundingClientRect();

    const top = targetBottom;
    let left = targetLeft;
    const bottom = top + menuHeight;
    let right = left + menuWidth;

    // 기본으로는 undefined 이기 때문에
    // 별도로 width, height 를 설정하지 않으면 style로도 적용이 안됨
    let width;
    let height;

    const containerHeight = window.innerHeight || document.documentElement.clientHeight;
    const containerWidth = window.innerWidth || document.documentElement.clientWidth;

    // dropdownMenu 크기가 윈도우 아래로 넘어갈 경우
    if (bottom > containerHeight) {
      const overflow = bottom - containerHeight;
      // height 를 줄여 바닥에서 조금 떨어지게 설정
      height = menuHeight - overflow - DROPDOWN_MARGIN;
      right += SCROLLBAR_WIDTH;
      // scroll bar 너비만큼 실제 크기를 늘려서 dropdownMenu의 레이아웃 보정
      width = menuWidth + SCROLLBAR_WIDTH;
    }

    // 운도우 우측으로 넘어가는 경우에 대한 처리
    // 부모 control의 우측 하단 기준으로 위치 조정
    if (right >= containerWidth) {
      left = left - menuWidth + targetWidth;
    }

    menuRef.current.style.top = `${top}px`;
    menuRef.current.style.left = `${left}px`;
    menuRef.current.style.height = `${height}px`;
    menuRef.current.style.width = `${width}px`;
  }, [isOpen, targetRef.current]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleResize() {
      setIsOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return {
    targetRef,
    menuRef,
    isOpen,
    openMenu,
    toggleMenu,
    closeMenu,
  };
};

export default useDropdownMenu;
