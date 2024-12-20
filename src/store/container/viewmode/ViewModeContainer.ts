import { boundMethod } from 'autobind-decorator';
import SlideModel from 'model/node/slide/SlideModel';

export default class ViewModeContainer {
  private zoomRatio: number;

  private isFitZoom: boolean;

  private editViewSizeTrackerRef: Nullable<React.RefObject<HTMLDivElement>>;

  private rerenderEditViewFunction: Nullable<() => void>;

  private currentRenderingSlideModel: Nullable<SlideModel>;

  constructor() {
    this.zoomRatio = 1;
    this.isFitZoom = true;
    this.editViewSizeTrackerRef = undefined;
    this.rerenderEditViewFunction = undefined;
    this.currentRenderingSlideModel = undefined;
  }

  @boundMethod
  public getZoomRatio(): number {
    return this.zoomRatio;
  }

  @boundMethod
  public setZoomRatio(zoomRatio: number): void {
    this.zoomRatio = zoomRatio;
  }

  @boundMethod
  public getIsFitZoom(): boolean {
    return this.isFitZoom;
  }

  @boundMethod
  public setIsFitZoom(isFitZoom: boolean): void {
    this.isFitZoom = isFitZoom;
  }

  @boundMethod
  public setEditViewSizeTrackerRef(
    editViewSizeTrackerRef: Nullable<React.RefObject<HTMLDivElement>>
  ): void {
    this.editViewSizeTrackerRef = editViewSizeTrackerRef;
  }

  @boundMethod
  public getEditViewSizeTrackerRef(): Nullable<React.RefObject<HTMLDivElement>> {
    return this.editViewSizeTrackerRef;
  }

  @boundMethod
  public setRerenderEditViewFunction(rerenderEditViewFunction: () => void): void {
    this.rerenderEditViewFunction = rerenderEditViewFunction;
  }

  @boundMethod
  public rerenderEditView(): void {
    if (this.rerenderEditViewFunction !== undefined) {
      this.rerenderEditViewFunction();
    }
  }

  @boundMethod
  public setCurrentRenderingSlideModel(slideModel: Nullable<SlideModel>): void {
    this.currentRenderingSlideModel = slideModel;
  }

  @boundMethod
  public getCurrentRenderingSlideModel(): Nullable<SlideModel> {
    return this.currentRenderingSlideModel;
  }
}
