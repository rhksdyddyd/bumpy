import TreeNode from 'model/node/TreeNode';
import { ISize } from 'types/common/geometry/GeometryTypes';
import { TreeNodeTypeEnum } from 'types/model/node/TreeNodeTypeEnum';
import { boundMethod } from 'autobind-decorator';
import FillInfo from '../graphic/info/FillInfo';

export default class SlideModel extends TreeNode {
  /**
   * 너비
   */
  private width: number;

  /**
   * 높이
   */
  private height: number;

  private fillInfo: Nullable<FillInfo>;

  private calculateContentsSizeRef: Nullable<React.MutableRefObject<number>>;

  /**
   * 생성자
   *
   * @param id 개체에 부여 할 id
   */
  constructor(id: number) {
    super(id);
    this.width = 1300;
    this.height = 700;
    this.fillInfo = undefined;
    this.calculateContentsSizeRef = undefined;
  }

  /**
   * 크기를 반환합니다.
   *
   * @returns SlideModel의 너비와 높이 정보
   */
  @boundMethod
  public getSize(): ISize {
    return { width: this.width, height: this.height };
  }

  @boundMethod
  public getFillInfo(): Nullable<FillInfo> {
    return this.fillInfo;
  }

  @boundMethod
  public setCalculateContentsSizeRef(
    calculateContentsSizeRef: Nullable<React.MutableRefObject<number>>
  ): void {
    this.calculateContentsSizeRef = calculateContentsSizeRef;
  }

  @boundMethod
  public checkCalculateContentsSizeRef(): void {
    if (this.calculateContentsSizeRef !== undefined) {
      this.calculateContentsSizeRef.current += 1;
    }
  }

  /**
   * SlideModel의 TreeNode로서 type을 반환합니다.
   *
   * @returns slide model임을 알려주는 TreeNodeTypeEnum
   */
  public getTreeNodeType(): TreeNodeTypeEnum {
    return TreeNodeTypeEnum.SLIDE;
  }
}
