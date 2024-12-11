import { boundMethod } from 'autobind-decorator';
import DummieToolPaneComponent from 'component/frame/workarea/toolpane/extended/DummieToolPaneComponent';
import DummyToolPaneComponent from 'component/frame/workarea/toolpane/extended/DummyToolPaneComponent';
import { ResourceEnum } from 'types/resource/ResourceEnum';
import {
  BasicToolPane,
  ToolPaneInfo,
  ToolPaneInfoMap,
} from 'types/store/container/ui/toolpane/ToolPaneContainerTypes';
import { ToolPaneTypeEnum } from 'types/store/container/ui/toolpane/ToolPaneTypeEnum';

export default class ToolPaneContainer {
  private toolPaneInfoMap: ToolPaneInfoMap;

  private toolPaneList: Array<ToolPaneTypeEnum>;

  private isToolPaneOpened: boolean;

  private isOpenWithAnimation: boolean;

  private selectedToolPaneId: Nullable<ToolPaneTypeEnum>;

  private rerenderToolPaneWrapperFunction: Nullable<() => void>;

  private closeToolPaneFunction: Nullable<() => void>;

  public constructor() {
    this.toolPaneInfoMap = this.initToolPaneInfoMap();
    this.toolPaneList = this.initToolPaneList();
    this.isToolPaneOpened = false;
    this.isOpenWithAnimation = false;
    this.selectedToolPaneId = undefined;
    this.rerenderToolPaneWrapperFunction = undefined;
    this.closeToolPaneFunction = undefined;
  }

  @boundMethod
  private initToolPaneInfoMap(): ToolPaneInfoMap {
    return new Map([
      [
        ToolPaneTypeEnum.DUMMY,
        {
          img: ResourceEnum.IMG_TOOLPANE_DOCK_DUMMY,
          type: BasicToolPane,
          content: DummyToolPaneComponent,
        },
      ],
      [
        ToolPaneTypeEnum.DUMMIE,
        {
          img: ResourceEnum.IMG_TOOLPANE_DOCK_DUMMIE,
          type: BasicToolPane,
          content: DummieToolPaneComponent,
        },
      ],
    ]);
  }

  @boundMethod
  private initToolPaneList(): Array<ToolPaneTypeEnum> {
    return [ToolPaneTypeEnum.DUMMY, ToolPaneTypeEnum.DUMMIE];
  }

  @boundMethod
  public getToolPaneInfo(toolPaneId: Nullable<ToolPaneTypeEnum>): Nullable<ToolPaneInfo> {
    if (toolPaneId !== undefined) {
      return this.toolPaneInfoMap.get(toolPaneId);
    }
    return undefined;
  }

  @boundMethod
  public getToolPaneInfoList(): [ToolPaneTypeEnum, Nullable<ToolPaneInfo>][] {
    return this.toolPaneList.map(toolPaneId => {
      return [toolPaneId, this.getToolPaneInfo(toolPaneId)];
    });
  }

  @boundMethod
  public getIsToolPaneOpened(): boolean {
    return this.isToolPaneOpened;
  }

  @boundMethod
  private setIsToolPaneOpened(isToolPaneOpened: boolean): void {
    this.isToolPaneOpened = isToolPaneOpened;
  }

  @boundMethod
  public getIsOpenWithAnimation(): boolean {
    return this.isOpenWithAnimation;
  }

  @boundMethod
  private setIsOpenWithAnimation(isOpenWithAnimation: boolean): void {
    this.isOpenWithAnimation = isOpenWithAnimation;
  }

  @boundMethod
  public getSelectedToolPaneId(): Nullable<ToolPaneTypeEnum> {
    return this.selectedToolPaneId;
  }

  @boundMethod
  private setSelectedToolPaneId(selectedToolPaneId: Nullable<ToolPaneTypeEnum>): void {
    this.selectedToolPaneId = selectedToolPaneId;
  }

  @boundMethod
  public setRerenderToolPaneWrapperFunction(rerenderToolPaneWrapperFunction: () => void): void {
    this.rerenderToolPaneWrapperFunction = rerenderToolPaneWrapperFunction;
  }

  @boundMethod
  public setCloseToolPaneFunction(closeToolPaneFunction: () => void): void {
    this.closeToolPaneFunction = closeToolPaneFunction;
  }

  @boundMethod
  public openToolPane(toolPaneId: ToolPaneTypeEnum): void {
    if (this.getIsToolPaneOpened() === false) {
      this.setIsToolPaneOpened(true);
      this.setIsOpenWithAnimation(true);
    } else {
      this.setIsOpenWithAnimation(false);
    }
    this.setSelectedToolPaneId(toolPaneId);
    if (this.rerenderToolPaneWrapperFunction !== undefined) {
      this.rerenderToolPaneWrapperFunction();
    }
  }

  @boundMethod
  public closeToolPane(): void {
    if (this.closeToolPaneFunction !== undefined) {
      this.closeToolPaneFunction();
      this.closeToolPaneFunction = undefined;
    }
    setTimeout(() => {
      this.setIsToolPaneOpened(false);
      if (this.rerenderToolPaneWrapperFunction !== undefined) {
        this.rerenderToolPaneWrapperFunction();
      }
    }, 400);
  }

  @boundMethod
  public closeToolPaneByCloseIcon(): void {
    this.closeToolPane();
  }

  @boundMethod
  public onToolPaneDockButtonClicked(toolPaneId: ToolPaneTypeEnum): void {
    if (this.getIsToolPaneOpened() === true && this.getSelectedToolPaneId() === toolPaneId) {
      this.closeToolPane();
      return;
    }
    this.openToolPane(toolPaneId);
  }
}
