import { boundMethod } from 'autobind-decorator';
import CoordinateInfo from 'model/node/graphic/info/CoordinateInfo';
import FillInfo from 'model/node/graphic/info/FillInfo';
import PathInfo from 'model/node/graphic/info/PathInfo';
import StrokeInfo from 'model/node/graphic/info/StrokeInfo';
import TreeNode from 'model/node/TreeNode';
import { GraphicTypeEnum } from 'types/model/node/graphic/GraphicTypeEnum';
import { TreeNodeTypeEnum } from 'types/model/node/TreeNodeTypeEnum';
import IdGenerator from 'util/id/IdGenerator';

/**
 * Graphic object 를 나타내는 모델입니다.
 */
export default class GraphicModel extends TreeNode {
  /**
   * GraphicModel 개체의 종류를 구분하기 위한 변수입니다.
   */
  private graphicType: GraphicTypeEnum;

  /**
   * 그래픽 개체의 크기, 좌표, 회전 등의 정보를 관리하는 Class 입니다.
   */
  private coordinateInfo: CoordinateInfo;

  /**
   * 그래픽 개체의 Path 정보를 관리하는 class 입니다.
   */
  private pathInfo: Nullable<PathInfo>;

  /**
   * 그래픽 개체의 채우기 스타일 정보를 관리하는 Class 입니다.
   */
  private fillInfo: Nullable<FillInfo>;

  /**
   * 그래픽 개체의 윤곽선 스타일 정보를 관리하는 Class 입니다.
   */
  private strokeInfo: Nullable<StrokeInfo>;

  /**
   * object의 현재 편집 상태를 나타내는 값입니다.
   */
  private isBeingEdited: boolean;

  /**
   * object 가 현재 선택되어 있는지 나타내는 값입니다.
   */
  private selected: boolean;

  /**
   * 생성자
   *
   * @param id GraphicComponent에 부여 할 id
   */
  constructor(id: number) {
    super(id);
    this.graphicType = GraphicTypeEnum.SHAPE;
    this.coordinateInfo = new CoordinateInfo();
    this.pathInfo = undefined;
    this.fillInfo = undefined;
    this.strokeInfo = undefined;
    this.isBeingEdited = false;
    this.selected = false;
  }

  /**
   * GrahpicModel의 TreeNode로서 type을 반환합니다.
   *
   * @returns Graphic model임을 알려주는 TreeNodeTypeEnum
   */
  public getTreeNodeType(): TreeNodeTypeEnum {
    return TreeNodeTypeEnum.GRAPHIC_MODEL;
  }

  /**
   * GrahpicModel을 shape으로 사용하기 위해 초기화 합니다.
   */
  @boundMethod
  public initAsShape(): void {
    this.graphicType = GraphicTypeEnum.SHAPE;
    this.pathInfo = new PathInfo();
    this.fillInfo = new FillInfo();
    this.strokeInfo = new StrokeInfo();
  }

  /**
   * GraphicModel을 Group으로 사용하기 위해 초기화 합니다.
   */
  @boundMethod
  public initAsGroup(): void {
    this.graphicType = GraphicTypeEnum.GROUP;
    this.fillInfo = new FillInfo();
  }

  /**
   * GraphicModel을 새로 복사하여 반환합니다.
   *
   * @returns 새로 복제 된 GrahpicModel
   */
  @boundMethod
  public clone(): GraphicModel {
    const cloned = new GraphicModel(IdGenerator.generateId());
    // graphic enum clone
    cloned.setGraphicType(this.graphicType);
    cloned.setCoordinateInfo(this.coordinateInfo.clone());
    cloned.setPathInfo(this.pathInfo?.clone());
    cloned.setFillInfo(this.fillInfo?.clone());
    cloned.setStrokeInfo(this.strokeInfo?.clone());

    return cloned;
  }

  /**
   * grahpic type을 설정합니다.
   *
   * @param graphicType 새로 설정 할 graphic type
   */
  @boundMethod
  public setGraphicType(graphicType: GraphicTypeEnum): void {
    this.graphicType = graphicType;
  }

  /**
   * graphic type을 반환합니다.
   *
   * @returns grahpicType
   */
  @boundMethod
  public getGraphicType(): GraphicTypeEnum {
    return this.graphicType;
  }

  /**
   * coordinateInfo 를 설정합니다.
   *
   * @param coordinateInfo 새롭게 설정 할 coordinateInfo
   */
  @boundMethod
  public setCoordinateInfo(coordinateInfo: CoordinateInfo): void {
    this.coordinateInfo = coordinateInfo;
  }

  /**
   * coordinateInfo를 반환합니다.
   *
   * @returns grahpicModel의 coordinateInfo
   */
  @boundMethod
  public getCoordinateInfo(): CoordinateInfo {
    return this.coordinateInfo;
  }

  /**
   * pathInfo를 설정합니다.
   *
   * @param pathInfo 새롭게 설정 할 pathInfo
   */
  @boundMethod
  public setPathInfo(pathInfo: Nullable<PathInfo>): void {
    this.pathInfo = pathInfo;
  }

  /**
   * pathInfo를 반환합니다.
   *
   * @returns graphicModel의 PathInfo
   */
  @boundMethod
  public getPathInfo(): Nullable<PathInfo> {
    return this.pathInfo;
  }

  /**
   * fillInfo를 설정합니다.
   *
   * @param fillInfo 새롭게 설정 할 fillInfo
   */
  @boundMethod
  public setFillInfo(fillInfo: Nullable<FillInfo>): void {
    this.fillInfo = fillInfo;
  }

  /**
   * fillInfo를 반환합니다.
   *
   * @returns graphicModel의 fillInfo
   */
  @boundMethod
  public getFillInfo(): Nullable<FillInfo> {
    return this.fillInfo;
  }

  /**
   * strokeInfo를 설정합니다.
   *
   * @param strokeInfo 새롭게 설정 할 strokeInfo
   */
  @boundMethod
  public setStrokeInfo(strokeInfo: Nullable<StrokeInfo>): void {
    this.strokeInfo = strokeInfo;
  }

  /**
   * strokeInfo를 반환합니다.
   *
   * @returns grahpicModel의 strokeInfo
   */
  @boundMethod
  public getStrokeInfo(): Nullable<StrokeInfo> {
    return this.strokeInfo;
  }

  /**
   * 현재 도형이 편집 중인지 설정합니다.
   *
   * @param beingEdited 현재 도형의 편집 상태
   */
  @boundMethod
  public setIsBeingEdited(isBeingEdited: boolean): void {
    this.isBeingEdited = isBeingEdited;
  }

  /**
   * 현재 도형의 편집 상태를 반환합니다.
   *
   * @returns 현재 도형의 편집 상태
   */
  @boundMethod
  public getIsBeingEdited(): boolean {
    return this.isBeingEdited;
  }

  /**
   * 현재 도형이 선택되어 있는 상태인지 설정합니다.
   *
   * @param selected 도형이 선택되어 있는 상태
   */
  @boundMethod
  public setSelected(selected: boolean): void {
    this.selected = selected;
  }

  /**
   * 현재 도형이 선택되어 있는지 반환합니다.
   *
   * @returns 도형이 선택되어 있는 상태
   */
  @boundMethod
  public getSelected(): boolean {
    return this.selected;
  }
}
