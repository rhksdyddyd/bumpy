import { boundMethod } from 'autobind-decorator';
import GraphicModel from 'model/node/graphic/GraphicModel';
import TreeNode from 'model/node/TreeNode';
import GraphicModelSelection from 'store/manager/selection/graphic/GraphicModelSelection';
import InternalSelectionContainer from 'store/manager/selection/InternalSelectionContainer';
import { getRootGroup, isGroupMember } from 'util/node/graphic/GraphicModelTreeNodeUtil';
import { isGraphicModel } from 'util/node/TreeNodeTypeGuards';

/**
 * GraphicModel의 selection을 관리하는 class 입니다.
 */
export default class GraphicModelSelectionContainer extends InternalSelectionContainer {
  /**
   * GraphicModel의 selection list
   */
  private graphicModelSelections: GraphicModelSelection[];

  /**
   * 생성자
   */
  constructor() {
    super();
    this.graphicModelSelections = new Array<GraphicModelSelection>();
  }

  /**
   * 이 selection container에 추가 할 수 있는 type인지 확인합니다.ㅣ
   *
   * @param treeNode 추가하고 싶은 node
   * @returns SelectionContainer에 추가 할 수 있는지의 여부
   */
  @boundMethod
  public isRelatedModel(treeNode: TreeNode): boolean {
    return isGraphicModel(treeNode);
  }

  /**
   * node를 selection에 추가합니다.
   *
   * @param model selection에 추가하고 싶은 treeNode
   */
  @boundMethod
  public appendTreeNode(model: TreeNode): void {
    const graphicModel = model;
    if (isGraphicModel(graphicModel)) {
      this.graphicModelSelections.push(new GraphicModelSelection(graphicModel));
    }
  }

  /**
   * 이 selection container가 selection을 가지고 있는지 확인합니다.
   *
   * @returns selection이 하나라도 있으면 true
   */
  @boundMethod
  public hasSelection(): boolean {
    return this.getSize() > 0;
  }

  /**
   * selection에 담겨있는 모든 treeNode를 반환합니다.
   *
   * @returns selection에 담겨있는 모든 treeNode
   */
  @boundMethod
  public getSelectedModels(): TreeNode[] {
    return this.graphicModelSelections.map(graphicModelSelection => {
      return graphicModelSelection.getModel();
    });
  }

  /**
   * selection 전체를 반환합니다.
   *
   * @returns 가지고있는 graphicModelSelectionList
   */
  @boundMethod
  public getGraphicModelSelections(): GraphicModelSelection[] {
    return this.graphicModelSelections;
  }

  /**
   * selection 중 첫 번째 selection을 반환합니다.
   *
   * @returns 가지고 있는 selection 중 첫 번째 selection
   */
  @boundMethod
  public getFirstGraphicModelSelection(): GraphicModelSelection | undefined {
    return this.graphicModelSelections.length !== 0 ? this.graphicModelSelections[0] : undefined;
  }

  /**
   * 특정 graphicModel을 포함한 selection을 가지고 있는지 확인합니다.
   *
   * @param graphicModel 확인 할 graphicModel
   * @returns grahpicModel이 selection에 포함되어 있으면 true
   */
  @boundMethod
  public hasGraphicModelSelection(graphicModel: GraphicModel): boolean {
    return this.getGraphicModelSelection(graphicModel) !== undefined;
  }

  /**
   * 특정 graphicModel을 담고 있는 selection을 반환합니다.
   *
   * @param graphicModel 확인 할 graphicModel
   * @returns graphicModel을 담고 있는 selection
   */
  @boundMethod
  public getGraphicModelSelection(graphicModel: GraphicModel): Nullable<GraphicModelSelection> {
    return this.graphicModelSelections.find(graphicModelSelection => {
      return graphicModelSelection.getModel() === graphicModel;
    });
  }

  /**
   * 현재 selection의 크기를 반환합니다.
   *
   * @returns 현재 selection의 크기
   */
  @boundMethod
  public getSize(): number {
    return this.graphicModelSelections.length;
  }

  /**
   * 특정 rootGroup의 하위 treeNode가 selection에 포함되어 있는지 확인합니다.
   *
   * @param rootGroup 확인 할 rootGroup
   * @returns 해당 rootGroup의 tree를 구성하는 node중 하나라도 selection에 있으면 true
   */
  @boundMethod
  public hasTargetRootGroupMember(rootGroup: GraphicModel): boolean {
    return (
      this.graphicModelSelections.find(graphicModelSelection => {
        return getRootGroup(graphicModelSelection.getModel()) === rootGroup;
      }) !== undefined
    );
  }

  /**
   * selection을 구성하는 node 중 하나라도 group과 관련이 있는지 확인합니다.
   * group인 node가 있거나, group tree를 구성하는 node인지 확인합니다.
   *
   * @returns selection에 group인 node가 있거나, group tree를 구성하는 node가 있으면 true
   */
  @boundMethod
  public hasGroupMemberInSelectionContainer(): boolean {
    return (
      this.graphicModelSelections.find(graphicModelSelection => {
        return isGroupMember(graphicModelSelection.getModel()) === true;
      }) !== undefined
    );
  }

  /**
   * GraphicModelSelectionContainer를 복사하여 반환합니다
   *
   * @returns 복사한 graphicModelSelectionContainer
   */
  @boundMethod
  public clone(): GraphicModelSelectionContainer {
    const graphicModelSelectionContainer = new GraphicModelSelectionContainer();
    this.graphicModelSelections.forEach(graphicModelSelection => {
      graphicModelSelectionContainer.graphicModelSelections.push(graphicModelSelection.clone());
    });
    return graphicModelSelectionContainer;
  }
}
