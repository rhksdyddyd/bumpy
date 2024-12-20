import { boundMethod } from 'autobind-decorator';
import TreeNode from 'model/node/TreeNode';
import { ICursorInfo } from 'types/common/cursor/CursorTypes';

class ProxyLayerInfoContainer {
  private isAppAreaProxyLayerEnabled: boolean;

  private isEditViewProxyLayerEnabled: boolean;

  private isAppAreaEventProxyEnabled: boolean;

  private isEditViewEventProxyEnabled: boolean;

  private isAppAreaEventBlocked: boolean;

  private appAreaCursorInfo: Nullable<ICursorInfo>;

  private editViewCursorInfo: Nullable<ICursorInfo>;

  private rerenderAppAreaProxyLayerFunction: Nullable<() => void>;

  private rerenderEditViewProxyLayerFunction: Nullable<() => void>;

  private eventTarget: Nullable<TreeNode>;

  public constructor() {
    this.isAppAreaProxyLayerEnabled = false;
    this.isEditViewProxyLayerEnabled = false;
    this.isAppAreaEventProxyEnabled = false;
    this.isEditViewEventProxyEnabled = false;
    this.isAppAreaEventBlocked = false;
    this.appAreaCursorInfo = undefined;
    this.editViewCursorInfo = undefined;
    this.rerenderAppAreaProxyLayerFunction = undefined;
    this.rerenderEditViewProxyLayerFunction = undefined;
    this.eventTarget = undefined;
  }

  @boundMethod
  public getIsAppAreaProxyLayerEnabled(): boolean {
    return this.isAppAreaProxyLayerEnabled;
  }

  @boundMethod
  public getIsEditViewProxyLayerEnabled(): boolean {
    return this.isEditViewProxyLayerEnabled;
  }

  @boundMethod
  public getIsAppAreaEventProxyEnabled(): boolean {
    return this.isAppAreaEventProxyEnabled;
  }

  @boundMethod
  public getIsEditViewEventProxyEnabled(): boolean {
    return this.isEditViewEventProxyEnabled;
  }

  @boundMethod
  public getIsAppAreaEventBlocked(): boolean {
    return this.isAppAreaEventBlocked;
  }

  @boundMethod
  public getAppAreaCursorInfo(): Nullable<ICursorInfo> {
    return this.appAreaCursorInfo;
  }

  @boundMethod
  public getEditViewCursorInfo(): Nullable<ICursorInfo> {
    return this.editViewCursorInfo;
  }

  @boundMethod
  public setRerenderAppAreaProxyLayerFunction(rerenderAppAreaProxyLayerFunction: () => void): void {
    this.rerenderAppAreaProxyLayerFunction = rerenderAppAreaProxyLayerFunction;
  }

  @boundMethod
  private rerenderAppAreaProxyLayer(): void {
    if (this.rerenderAppAreaProxyLayerFunction !== undefined) {
      this.rerenderAppAreaProxyLayerFunction();
    }
  }

  @boundMethod
  public setRerenderEditViewProxyLayerFunction(
    rerenderEditViewProxyLayerFunction: () => void
  ): void {
    this.rerenderEditViewProxyLayerFunction = rerenderEditViewProxyLayerFunction;
  }

  @boundMethod
  private rerenderEditViewProxyLayer(): void {
    if (this.rerenderEditViewProxyLayerFunction !== undefined) {
      this.rerenderEditViewProxyLayerFunction();
    }
  }

  @boundMethod
  public getEventTarget(): Nullable<TreeNode> {
    return this.eventTarget;
  }

  @boundMethod
  public enableAppAreaProxyLayer(
    eventTarget: Nullable<TreeNode>,
    appAreaCursorInfo: Nullable<ICursorInfo>,
    isAppAreaEventProxyEnabled: boolean,
    isAppAreaEventBlocked: boolean
  ): void {
    this.isAppAreaProxyLayerEnabled = true;
    this.isAppAreaEventProxyEnabled = isAppAreaEventProxyEnabled;
    this.isAppAreaEventBlocked = isAppAreaEventBlocked;
    this.appAreaCursorInfo = appAreaCursorInfo;
    this.eventTarget = eventTarget;
    this.rerenderAppAreaProxyLayer();
  }

  @boundMethod
  public disableAppAreaProxyLayer(): void {
    this.isAppAreaProxyLayerEnabled = false;
    this.isAppAreaEventProxyEnabled = false;
    this.isAppAreaEventBlocked = false;
    this.appAreaCursorInfo = undefined;
    this.eventTarget = undefined;
    this.rerenderAppAreaProxyLayer();
  }

  @boundMethod
  public enableEditViewProxyLayer(
    eventTarget: Nullable<TreeNode>,
    editViewCursorInfo: Nullable<ICursorInfo>,
    isEditViewEventProxyEnabled: boolean
  ): void {
    this.isEditViewProxyLayerEnabled = true;
    this.isEditViewEventProxyEnabled = isEditViewEventProxyEnabled;
    this.editViewCursorInfo = editViewCursorInfo;
    this.eventTarget = eventTarget;
    this.rerenderEditViewProxyLayer();
  }

  @boundMethod
  public disableEditViewProxyLayer(): void {
    this.isEditViewProxyLayerEnabled = false;
    this.isEditViewEventProxyEnabled = false;
    this.editViewCursorInfo = undefined;
    this.eventTarget = undefined;
    this.rerenderEditViewProxyLayer();
  }
}

export default ProxyLayerInfoContainer;
