import { boundMethod } from 'autobind-decorator';
import EditableContext from 'store/context/EditableContext';
import ReadOnlyContext from 'store/context/ReadOnlyContext';
import { IAppContextInitProp } from 'types/store/context/AppContextTypes';

/**
 * RootStore 에서 관리하는 context 구조입니다.
 */
export default class AppContext {
  /**
   * read only context 정보
   */
  private readOnlyContext: ReadOnlyContext;

  /**
   * editable context 정보
   */
  private editableContext: EditableContext;

  /**
   * 생성자
   */
  constructor(appContextInitProp: IAppContextInitProp) {
    this.readOnlyContext = new ReadOnlyContext(appContextInitProp.readOnlyContextInitProp);
    this.editableContext = new EditableContext(appContextInitProp.editableContextInitProp);
  }

  /**
   * readOnlyContext를 반환합니다.
   *
   * @returns readOnlyContext
   */
  @boundMethod
  public getReadOnlyContext(): ReadOnlyContext {
    return this.readOnlyContext;
  }

  /**
   * editableContext를 반환합니다.
   *
   * @returns editableContext
   */
  @boundMethod
  public getEditableContext(): EditableContext {
    return this.editableContext;
  }
}
