/**
 * 현재 app의 실행 상태에 따른 Command의 실행 mode를 구분하는 데 사용합니다.
 * readonly mode 등을 추가 할 수 있습니다.
 */
export enum CommandModeEnum {
  INVALID = 0,
  EDIT,
}
