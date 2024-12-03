import { boundMethod } from 'autobind-decorator';
import { ICommandProps } from 'types/store/BasicTypes';
import { IReadOnlyContextInitProp } from 'types/store/context/AppContextTypes';

/**
 * App의 실행 도중 변경되지 않는 정보를 담고 있는 context 입니다.
 */
export default class ReadOnlyContext {
  /**
   * AppStore의 handleCommandEvent를 호출하는 함수입니다.
   * AppStore에 접근이 불가능한 경우 AppContext가 있으면 이 함수를 통하여 호출할 수 있습니다.
   */
  private readonly handleCommandEvent: (props: ICommandProps) => void;

  /**
   * 생성자
   *
   * @param readOnlyContextInitProp 초기화 prop
   */
  constructor(readOnlyContextInitProp: IReadOnlyContextInitProp) {
    this.handleCommandEvent = readOnlyContextInitProp.handleCommandEventFunction;
  }

  /**
   * AppStore의 handleCommandEvent를 호출합니다.
   *
   * @param props handleCommandEvent를 호출하기 위한 prop
   */
  @boundMethod
  public callHandleCommandEvent(props: ICommandProps): void {
    this.handleCommandEvent(props);
  }
}
