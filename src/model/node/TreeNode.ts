import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import { TreeNodeTypeEnum } from 'types/model/node/TreeNodeTypeEnum';

/**
 * Tree 와 관련된 로직이 구현된 abstract class입니다.
 */
export default abstract class TreeNode {
  /**
   * TreeNode 의 고유 ID 입니다.
   */
  private id: number;

  /**
   * 부모 node 를 가리킵니다.
   * extend하는 클래스에서 타입을 지정해 주어야 합니다
   */
  private parent?: TreeNode;

  /**
   * 자식 node 중 첫번째를 가리킵니다.
   */
  private firstChild?: TreeNode;

  /*
   * 자식 node 중 마지막을 가리킵니다.
   */
  private lastChild?: TreeNode;

  /**
   * 형제 node 중 다음을 가리킵니다.
   */
  private nextSibling?: TreeNode;

  /**
   * 형제 node 중 이전을 가리킵니다.
   */
  private prevSibling?: TreeNode;

  /**
   * rerender를 요청하는 함수입니다.
   */
  private rerenderTrigger: Nullable<() => void>;

  /**
   * 생성자
   *
   * @param id treeNode에 부여할 id
   */
  public constructor(id: number) {
    this.id = id;
    this.parent = undefined;
    this.firstChild = undefined;
    this.lastChild = undefined;
    this.nextSibling = undefined;
    this.prevSibling = undefined;
    this.rerenderTrigger = undefined;
  }

  /**
   * 해당 node 의 Id 를 반환합니다.
   *
   * @returns 해당 node 의 Id
   */
  @boundMethod
  public getId(): number {
    return this.id;
  }

  /**
   * 해당 node 의 Id 를 설정합니다
   *
   * @returns 해당 node 의 Id
   */
  @boundMethod
  public setId(id: number): void {
    this.id = id;
  }

  /**
   * 부모 node 를 반환합니다.
   *
   * @returns 부모 node
   */
  @boundMethod
  public getParent(): Nullable<TreeNode> {
    return this.parent;
  }

  /**
   * 부모 node 를 설정합니다.
   *
   * @param parent 해당 node 의 부모
   */
  @boundMethod
  public setParent(parent?: TreeNode): void {
    this.parent = parent;
  }

  /**
   * 자식 node 중 첫번째를 반환합니다.
   *
   * @returns 첫번째 자식 node
   */
  @boundMethod
  public getFirstChild(): Nullable<TreeNode> {
    return this.firstChild;
  }

  /**
   * 첫번째 자식 node 를 설정합니다.
   *
   * @param firstChild 해당 node 의 첫번째 자식
   */
  @boundMethod
  public setFirstChild(firstChild?: TreeNode): void {
    this.firstChild = firstChild;
  }

  /**
   * 자식 node 중 마지막을 반환합니다.
   *
   * @returns 마지막 자식 node
   */
  @boundMethod
  public getLastChild(): Nullable<TreeNode> {
    return this.lastChild;
  }

  /**
   * 마지막 자식 node 를 설정합니다.
   *
   * @param lastChild 해당 node 의 마지막 자식
   */
  @boundMethod
  public setLastChild(lastChild?: TreeNode): void {
    this.lastChild = lastChild;
  }

  /**
   * 다음 형제 node 를 반환합니다.
   *
   * @returns 다음 형제 node
   */
  @boundMethod
  public getNextSibling(): Nullable<TreeNode> {
    return this.nextSibling;
  }

  /**
   * 다음 형제 node 를 설정합니다.
   *
   * @param nextSibling 해당 node 의 다음 형제
   */
  @boundMethod
  public setNextSibling(nextSibling?: TreeNode): void {
    this.nextSibling = nextSibling;
  }

  /**
   * 이전 형제 node 를 반환 합니다.
   *
   * @returns 이전 형제 node
   */
  @boundMethod
  public getPrevSibling(): Nullable<TreeNode> {
    return this.prevSibling;
  }

  /**
   * 이전 형제 node 를 설정합니다.
   *
   * @param prevSibling 해당 node 의 이전 형제
   */
  @boundMethod
  public setPrevSibling(prevSibling?: TreeNode): void {
    this.prevSibling = prevSibling;
  }

  /**
   * rerenderTrigger 함수를 설정합니다.
   * component에서 설정합니다
   *
   * @param rerenderTrigger rerender를 발생시키는 함수
   */
  @boundMethod
  public setRerenderTrigger(rerenderTrigger: () => void): void {
    this.rerenderTrigger = rerenderTrigger;
  }

  /**
   * rendering 을 강제로 발생시키는 함수를 ctx에 등록합니다.
   * store는 특정 event가 끝난 다음 ctx에 모여있는 rerenderTrigger를 flush 합니다
   *
   * @param ctx trigger를 등록 할 AppContext
   */
  @boundMethod
  public appendRerenderTrigger(ctx: AppContext): void {
    if (this.rerenderTrigger !== undefined) {
      ctx.getEditableContext().appendRerenderTrigger(this.rerenderTrigger);
    }
  }

  /**
   * Child node 들을 순회하면서 callback 함수를 호출합니다.
   * Array 의 forEach() 와 유사한 동작을 합니다.
   *
   * @param callback 각 child node 에 동작을 수행할 함수
   */
  @boundMethod
  public forEachChild(callback: (child: TreeNode) => void): void {
    for (let it = this.firstChild; it !== undefined; it = it.nextSibling) {
      callback(it as TreeNode);
    }
  }

  /**
   * Child node 들을 순회하면서, callback 함수를 호출하여,
   * 새로운 array 를 생성하여 반환합니다.
   * Array 의 map() 와 유사한 동작을 합니다.
   *
   * @param callback 각 child node 에 동작을 수행할 함수
   * @returns 생성한 배열
   */
  @boundMethod
  public mapChild<T>(callback: (child: TreeNode) => T): T[] {
    const ret = [] as T[];
    this.forEachChild(child => {
      ret.push(callback(child));
    });
    return ret;
  }

  /**
   * 해당 node 를 부모에 추가합니다.
   * nextNode 인자를 사용하여 해당 node 앞에 추가할 수 있습니다.
   * nextNode가 없는 경우 부모 node 의 마지막 child가 됩니다.
   *
   * @param parentNode 해당 node 의 부모가 될 node
   * @param nextNode 해당 node 의 다음 형제가 될 node
   */
  @boundMethod
  public append(parentNode: TreeNode, nextNode?: TreeNode): void {
    if (nextNode !== undefined) {
      if (nextNode.getParent() !== parentNode) {
        console.error('tree 구성이 잘못되었습니다.');
        return;
      }
      parentNode.appendChildBefore(this, nextNode);
    } else {
      parentNode.appendChild(this);
    }
  }

  /**
   * 해당 node 를 부모에서 제거합니다.
   *
   * @param parentNode 해당 node 로부터 떼어질 부모 node
   */
  @boundMethod
  public remove(parentNode: TreeNode): void {
    parentNode.removeChild(this);
  }

  /**
   * 해당 node 를 마지막 child 로 붙입니다.
   *
   * @param newChild 해당 node 의 자식으로 붙을 node
   */
  @boundMethod
  private appendChild(newChild: TreeNode): void {
    newChild.setParent(this);
    if (this.firstChild === undefined) {
      this.firstChild = newChild;
      this.lastChild = newChild;
      newChild.setPrevSibling(undefined);
      newChild.setNextSibling(undefined);
    } else {
      this.lastChild?.setNextSibling(newChild);
      newChild.setPrevSibling(this.lastChild);
      newChild.setNextSibling(undefined);
      this.lastChild = newChild;
    }
  }

  /**
   * 해당 node 를 특정 자식 node 이전의 자식으로 추가합니다.
   *
   * @param newChild 새롭게 추가 할 자식 node
   * @param refChild 새로운 자식 node 다음에 있게 될 node
   */
  @boundMethod
  protected appendChildBefore(newChild: TreeNode, refChild: TreeNode): void {
    newChild.setParent(refChild.getParent());
    if (refChild === this.firstChild) {
      this.firstChild = newChild;
      newChild.setPrevSibling(undefined);
    } else {
      newChild.setPrevSibling(refChild.getPrevSibling());
      refChild.getPrevSibling()?.setNextSibling(newChild);
    }
    newChild.setNextSibling(refChild);
    refChild.setPrevSibling(newChild);
  }

  /**
   * 해당 node 를 child 에서 제거합니다.
   *
   * @param child 해당 node 로부터 제거될 자식 node
   */
  @boundMethod
  private removeChild(child: TreeNode): void {
    if (this.firstChild === child) {
      // 첫번째 자식인 경우
      if (this.lastChild === child) {
        // 자식이 1개인 경우
        this.firstChild = undefined;
        this.lastChild = undefined;
      } else {
        // 자식이 여러개인 경우
        this.firstChild = child.getNextSibling();
        this.firstChild?.setPrevSibling(undefined);
      }
    } else if (this.lastChild === child) {
      // 마지막 자식인 경우
      this.lastChild = child.getPrevSibling();
      this.lastChild?.setNextSibling(undefined);
    } else {
      // 가운데에 있는 자식인 경우
      child.getPrevSibling()?.setNextSibling(child.getNextSibling());
      child.getNextSibling()?.setPrevSibling(child.getPrevSibling());
    }
  }

  /**
   * node의 type을 반환합니다.
   *
   * @returns node의 type
   */
  public abstract getTreeNodeType(): TreeNodeTypeEnum;
}
