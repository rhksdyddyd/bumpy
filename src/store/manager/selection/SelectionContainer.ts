import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import GraphicModelSelectionContainer from 'store/manager/selection/graphic/GraphicModelSelectionContainer';
import InternalSelectionContainer from 'store/manager/selection/InternalSelectionContainer';

/**
 * 선택 된 개체의 목록을 저장하는 class 입니다
 * 개체의 종류별로 여러 개의 internalSelectionContainer를 가집니다.
 */
export default class SelectionContainer {
  /**
   * grahpic model의 선택을 담당합니다.
   */
  private graphicModelSelectionContainer: GraphicModelSelectionContainer;

  /**
   * 생성자
   */
  public constructor() {
    this.graphicModelSelectionContainer = new GraphicModelSelectionContainer();
  }

  /**
   * graphicSelectionContainer를 반환합니다.
   *
   * @returns graphicSelectionContainer
   */
  @boundMethod
  public getGraphicModelSelectionCotnainer(): GraphicModelSelectionContainer {
    return this.graphicModelSelectionContainer;
  }

  /**
   * 내부의 각 internalSelectionContainer 마다 callback 함수를 실행합니다.
   *
   * @param callback internalSelectionContainer 가 실행 할 함수
   */
  @boundMethod
  public forEachContainer(
    callback: (internalSelectionContainer: InternalSelectionContainer) => void
  ): void {
    callback(this.graphicModelSelectionContainer);
  }

  /**
   * treeNode를 internalSelectionContainer에 추가 합니다
   * 필요한 경우 서로 다른 internalSelectionContainer에 서로 다른 selection으로 등록 될 수 있습니다
   *
   * @param treeNode selection에 추가 할 node
   */
  @boundMethod
  public appendTreeNode(treeNode: TreeNode): void {
    this.forEachContainer(container => {
      if (container.isRelatedModel(treeNode) === true) {
        container.appendTreeNode(treeNode);
      }
    });
  }

  /**
   * SelectionContainer를 복사하여 반환합니다.
   *
   * @returns 복사한 selection container
   */
  @boundMethod
  public clone(): SelectionContainer {
    const selectionContainer = new SelectionContainer();
    selectionContainer.graphicModelSelectionContainer = this.graphicModelSelectionContainer.clone();
    return selectionContainer;
  }
}
