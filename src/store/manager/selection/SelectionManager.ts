import AppContext from 'store/context/AppContext';

/**
 * 사용자의 Selection 상태를 보여주기 위한 Object들을 관리하는 Class입니다.
 */
export default class SelectionManager {
  /**
   * 생성자
   */
  public constructor() {
    // need implementation
  }

  /**
   * AppContext에 eventState와 selection을 새롭게 설정합니다.
   *
   * @param ctx 변경이 필요한 AppContext
   */
  public updateSelection(ctx: AppContext): void {
    const editableContext = ctx.getEditableContext();
    const commandProps = editableContext.getCommandProps();

    if (commandProps !== undefined) {
      const { newEventState, newSelectionContainer } = commandProps;
      if (newEventState !== undefined) {
        editableContext.setEventState(newEventState);
      }
      if (newSelectionContainer !== undefined) {
        editableContext.setSelectionContainer(newSelectionContainer);
      }
      editableContext.getGraphicEditInfoContainer().requestRerenderSelectionLayer(ctx);
    }
  }
}
