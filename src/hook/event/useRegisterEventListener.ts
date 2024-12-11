import { useEffect } from 'react';

interface UseRegisterEventHandlerProps<K extends keyof HTMLElementEventMap> {
  eventType: K;
  eventHandler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void;
  capture?: boolean;
  allowRegister?: boolean;
  targetElement?: HTMLElement;
}

/**
 * @param eventType 이벤트의 종류
 * @param eventHandler 이벤트 처리 함수
 * @param options.capture capture 사용 여부
 * @param options.allowRegister 이벤트 리스너 등록 여부
 * @param options.targetElement 이벤트 타겟, 기본값은 <div id='app_root'>
 */
const useRegisterEventHandler = <K extends keyof HTMLElementEventMap>({
  eventType,
  eventHandler,
  capture,
  allowRegister,
  targetElement,
}: UseRegisterEventHandlerProps<K>): void => {
  useEffect(() => {
    const target = targetElement || document.getElementById('app_root');

    if (allowRegister === true) {
      target?.addEventListener(eventType, eventHandler, capture);
    } else {
      target?.removeEventListener(eventType, eventHandler, capture);
    }

    return () => {
      target?.removeEventListener(eventType, eventHandler, capture);
    };
  }, [allowRegister]);
};

export default useRegisterEventHandler;
