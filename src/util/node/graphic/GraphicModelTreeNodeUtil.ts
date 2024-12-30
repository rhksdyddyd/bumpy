import GraphicModel from 'model/node/graphic/GraphicModel';
import { GraphicTypeEnum } from 'types/model/node/graphic/GraphicTypeEnum';
import { isGraphicModel } from 'util/node/TreeNodeTypeGuards';

/**
 * 특정 GraphicModel이 group type인지 확인합니다.
 *
 * @param graphicModel group인지 검사 할 GraphicModel
 * @returns GraphicModel이 group type이면 true
 */
export function isGroup(graphicModel: GraphicModel): boolean {
  return graphicModel.getGraphicType() === GraphicTypeEnum.GROUP;
}

/**
 * GraphicModel의 parent group을 반환합니다.
 * parent group이 없는 경우 undefined를 반환합니다.
 *
 * @param graphicModel parent group을 찾을 graphic model
 * @returns graphicModel의 parentGroup
 */
export function getParentGroup(graphicModel: GraphicModel): Nullable<GraphicModel> {
  const parentNode = graphicModel.getParent();

  if (isGraphicModel(parentNode) && isGroup(parentNode) === true) {
    return parentNode;
  }

  return undefined;
}

/**
 * graphicModel이 group의 자식인지 확인합니다.
 *
 * @param graphicModel group의 자식인지 확인 할 graphicModel
 * @returns grahpicModel이 group의 자식이면 true
 */
export function isGroupChild(graphicModel: GraphicModel): boolean {
  return getParentGroup(graphicModel) !== undefined;
}

/**
 * graphicModel이 gropu을 구성하는 tree의 일부인지 확인합니다.
 *
 * @param graphicModel group의 member인지 확인 할 graphicModel
 * @returns graphicModel이 group의 member인 경우 true
 */
export function isGroupMember(graphicModel: GraphicModel): boolean {
  return isGroup(graphicModel) === true || isGroupChild(graphicModel) === true;
}

/**
 * 최 상위 group을 반환하는 함수입니다.
 * 인자로 받은 graphicModel을 포함하여 반환
 * graphicModel이 group member가 아닌 경우 undefined를 반환합니다.
 *
 * @param graphicModel 최상위 group을 찾을 graphicModel
 * @returns graphicModel의 최상위 group
 */
export function getRootGroup(graphicModel: GraphicModel): Nullable<GraphicModel> {
  let rootGroup: Nullable<GraphicModel>;
  let parentGroup: Nullable<GraphicModel>;
  let childGraphicModel = graphicModel;

  if (isGroup(graphicModel) === true) {
    rootGroup = graphicModel;
  }

  do {
    parentGroup = getParentGroup(childGraphicModel);

    if (parentGroup !== undefined) {
      rootGroup = parentGroup;
      childGraphicModel = parentGroup;
    }
  } while (parentGroup !== undefined);

  return rootGroup;
}

/**
 * group인 경우, 하위 tree의 모든 graphicModel을 array로 반환합니다.
 * 해당 graphicModel 이 group이 아니거나 group member가 아닌 경우 빈 array를 반환 합니다.
 *
 * @param graphicModel 자식 node를 수집 할 group
 * @returns 수집한 자식 node의 array
 */
export function getChildGraphicModelList(graphicModel: GraphicModel): Array<GraphicModel> {
  const childGraphicModelList = new Array<GraphicModel>();
  collectChildGraphicModelRecursively(graphicModel, childGraphicModelList);

  return childGraphicModelList;
}

/**
 * getChildGraphicModelList의 내부 함수입니다.
 * 재귀 호출을 위하여 별도로 분리하였습니다.
 *
 * @param parent 자식 node를 검색 할 group
 * @param childGraphicModelList 자식 node들을 담을 array
 */
function collectChildGraphicModelRecursively(
  parent: GraphicModel,
  childGraphicModelList: Array<GraphicModel>
) {
  if (isGroup(parent) === true) {
    parent.forEachChild(chlid => {
      if (isGraphicModel(chlid)) {
        childGraphicModelList.push(chlid);

        if (isGroup(chlid) === true) {
          collectChildGraphicModelRecursively(chlid, childGraphicModelList);
        }
      }
    });
  }
}

/**
 * 최 상위 group 부터 해당 group을 구성하는 모든 graphicModel을 array로 반환합니다.
 * 해당 graphicModel 이 group member가 아닌 경우 빈 array를 반환 합니다.
 *
 * @param graphicModel tree 구성요소를 수집 할 graphicModel
 * @returns root group부터 tree 구성 요소를 수집 한 array
 */
export function getAllGroupMemeberFromRootGroup(graphicModel: GraphicModel): Array<GraphicModel> {
  const groupMemberList = new Array<GraphicModel>();

  const rootGroup = getRootGroup(graphicModel);

  if (rootGroup !== undefined) {
    groupMemberList.push(rootGroup);
    collectChildGraphicModelRecursively(rootGroup, groupMemberList);
  }

  return groupMemberList;
}

/**
 * 바로 상단의 부모 group 부터 root group 까지 모든 부모 group을 모아서 반환하는 함수입니다.
 * 기본으로 가까운 부모부터 root group 까지 멀어지는 순으로 array 구성합니다.
 * 인자로 받은 graphicModel은 제외하고 반환합니다.
 *
 * @param graphicModel 부모 group 을 찾을 grahpicModel
 * @returns 부모 group을 모은 array
 */
export function getAllParentGroupList(
  graphicModel: GraphicModel,
  startFromRootGroup: boolean
): Array<GraphicModel> {
  let ancestorsList = new Array<GraphicModel>();
  let parentGroup: Nullable<GraphicModel> = graphicModel;

  do {
    parentGroup = getParentGroup(parentGroup);

    if (parentGroup !== undefined) {
      ancestorsList.push(parentGroup);
    }
  } while (parentGroup !== undefined);

  if (startFromRootGroup === true) {
    ancestorsList = ancestorsList.reverse();
  }

  return ancestorsList;
}
