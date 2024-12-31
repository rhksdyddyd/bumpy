import { boundMethod } from 'autobind-decorator';
import AppContext from 'store/context/AppContext';
import { isGraphicModel } from 'util/node/TreeNodeTypeGuards';
import { GraphicEditEventSubStateEnum } from 'types/store/container/edit/GraphicEditEventSubStateEnum';
import { EventStateEnum } from 'types/store/event/EventStateEnum';
import GraphicEditInfoContainer from 'store/container/edit/GraphicEditInfoContainer';
import { convertClientCoordinateToRenderCoordinate } from 'util/coordinate/RenderCoordinateUtil';
import GraphicModel from 'model/node/graphic/GraphicModel';
import { getRootGroup } from 'util/node/graphic/GraphicModelTreeNodeUtil';
import { updateNewSelectionContainer } from 'util/node/graphic/edit/GraphicModelEditingUtil';
import { CommandEnum } from 'types/store/command/CommandEnum';
import EventHandler from '../EventHandler';
import MouseEvent from '../../wrapper/MouseEvent';

class GraphicSelectionEventHandler extends EventHandler {
  @boundMethod
  public override onMouseDown(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();
    const editableContext = ctx.getEditableContext();
    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    const targetModel = event.getEventTargetModel();

    if (isGraphicModel(targetModel)) {
      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.READY);
      graphicEditInfoContainer.setEventTargetGraphicModel(targetModel);

      const eventState = editableContext.getEventState();
      const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
      const zoomRatio = editableContext.getViewModeContainer().getZoomRatio();

      if (this.isMouseDownValid(eventState, graphicEditInfoContainer) === false) {
        if (graphicEditEventSubState !== GraphicEditEventSubStateEnum.ABORT) {
          graphicEditInfoContainer.abortCurrentEditingState();
        }

        return true;
      }

      graphicEditInfoContainer.setGraphicEditEventSubState(GraphicEditEventSubStateEnum.PRESSED);

      const editingStartedRenderCoordinate = convertClientCoordinateToRenderCoordinate(
        { x: event.getClientX(), y: event.getClientY() },
        zoomRatio
      );

      graphicEditInfoContainer.setEditingStartedRenderCoordinate(editingStartedRenderCoordinate);

      graphicEditInfoContainer.setIsMultiSelectionEvent(event.isCtrlDown() || event.isShiftDown());
      this.updateSelectionOnMouseDown(event, ctx);
    }

    return true;
  }

  @boundMethod
  public override onMouseUp(event: MouseEvent, ctx: AppContext): boolean {
    event.stopPropagation();

    const editableContext = ctx.getEditableContext();
    const eventState = editableContext.getEventState();

    const selectionContainer = editableContext.getSelectionContainer();
    const graphicSelectionContainer = selectionContainer.getGraphicModelSelectionContainer();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();

    if (
      this.isMouseUpValid(eventState, graphicEditInfoContainer) !== false &&
      graphicSelectionContainer !== undefined
    ) {
      // GraphicMoveEventHandler에서 처리하도록 함
      return false;
    }

    const props = {
      commandId: CommandEnum.GRAPHIC_MOVE_ABORT,
    };

    editableContext.setCommandProps(props);
    this.updateSelectionOnMouseUp(event, ctx);

    return true;
  }

  private isMouseDownValid(
    eventState: EventStateEnum,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): boolean {
    const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();
    if (
      eventState !== EventStateEnum.GRAPHIC_MOVE ||
      graphicEditEventSubState !== GraphicEditEventSubStateEnum.READY ||
      eventTargetGraphicModel === undefined
    ) {
      return false;
    }
    return true;
  }

  private isMouseUpValid(
    eventState: EventStateEnum,
    graphicEditInfoContainer: GraphicEditInfoContainer
  ): boolean {
    const graphicEditEventSubState = graphicEditInfoContainer.getGraphicEditEventSubState();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();
    if (
      eventState === EventStateEnum.GRAPHIC_MOVE &&
      graphicEditEventSubState === GraphicEditEventSubStateEnum.DRAG &&
      eventTargetGraphicModel !== undefined
    ) {
      return true;
    }
    return false;
  }

  private updateSelectionOnMouseDown(event: MouseEvent, ctx: AppContext): void {
    const editableContext = ctx.getEditableContext();

    const selectionContainer = editableContext.getSelectionContainer();
    const graphicSelectionContainer = selectionContainer.getGraphicModelSelectionContainer();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();

    const newSelectedGraphicModelList = new Array<GraphicModel>();

    if (eventTargetGraphicModel === undefined) {
      return;
    }

    const graphicSelectionSize = graphicSelectionContainer.getSize();

    const isSelectedGraphicModel =
      graphicSelectionContainer.hasGraphicModelSelection(eventTargetGraphicModel);

    const isMultiSelectionEvent = graphicEditInfoContainer.getIsMultiSelectionEvent();

    const rootGroup: Nullable<GraphicModel> = getRootGroup(eventTargetGraphicModel);
    const isRootGroupSelected = rootGroup
      ? graphicSelectionContainer.hasGraphicModelSelection(rootGroup)
      : false;

    const hasRootGroupMemberInSelectionContainer = rootGroup
      ? graphicSelectionContainer.hasTargetRootGroupMember(rootGroup)
      : false;

    let isSelectionRecentlyUpdated = false;

    if (isMultiSelectionEvent === true) {
      // multiselection event의 경우 기본적으로 release에서 selection에 변경 함
      if (rootGroup !== undefined) {
        // multiselection event
        // root group이 있는 경우
        if (eventTargetGraphicModel === rootGroup) {
          // multiselection event
          // root group이 있고, event target이 root group인 경우
          if (isRootGroupSelected === true) {
            // multiselection event
            // root group이 있고, event target이 root group인 경우
            // root group이 선택 된 경우
            // pressed에서 selection 변경하지 않음
            // drag로 진행하지 않을 경우 released에서 해당 root group을 selected list에서 제거
          } else {
            // multiselection event
            // root group이 있고, event target이 root group인 경우
            // root group이 선택 되지 않은 경우
            // root group의 leaf graphic model이 선택 된 상황에서
            // floating object를 선택하여 진입 한 경우 임
            // pressed에서 root group 만으로 selection 구성
            // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
            newSelectedGraphicModelList.push(rootGroup);
            updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
            isSelectionRecentlyUpdated = true;
          }
        } else {
          // multiselection event
          // root group이 있고, event target이 group의 leaf graphic model인 경우
          // eslint-disable-next-line no-lonely-if
          if (isRootGroupSelected === true) {
            // multiselection event
            // root group이 있고, event target이 group의 leaf graphic model인 경우
            // root group 이 선택 된 경우
            if (graphicSelectionSize === 1) {
              // multiselection event
              // root group이 있고, event target이 group의 leaf graphic model인 경우
              // root group 이 선택 된 경우
              // root group 만 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않을 경우 released에서 eventTargetGraphicModel만으로 selection 구성
            } else {
              // multiselection event
              // root group이 있고, event target이 group의 leaf graphic model인 경우
              // root group 이 선택 된 경우
              // root group 및 다른 root graphic model 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않을 경우 released에서 root group을 selected list에서 제거
            }
          } else {
            // multiselection event
            // root group이 있고, event target이 group의 leaf graphic model인 경우
            // root group 이 선택 되지 않은 경우
            // eslint-disable-next-line no-lonely-if
            if (isSelectedGraphicModel === true) {
              // multiselection event
              // root group이 있고, event target이 group의 leaf graphic model인 경우
              // root group 이 선택 되지 않은 경우
              // eventTargetGraphicModel이 선택되어 있는 경우
              if (graphicSelectionSize === 1) {
                // pressed에서 eventTargetGraphicModel을 기존의 selected list 에 추가
                // drag로 진행 할 경우 selection 변경하지 않음
                // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
                // eventTargetGraphicModel이 선택되어 있는 경우
                // eventTargetGraphicModel만 선택되어 있는 경우
                // pressed에서 selection 변경하지 않음
                // drag로 진행하지 않을 경우 released에서 root group만으로 selection 구성
              } else {
                // pressed에서 eventTargetGraphicModel을 기존의 selected list 에 추가
                // drag로 진행 할 경우 selection 변경하지 않음
                // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
                // eventTargetGraphicModel이 선택되어 있는 경우
                // eventTargetGraphicModel 및 같은 root group의 다른 leaf graphic model이 선택되어 있는 경우
                // pressed에서 selection 변경하지 않음
                // drag로 진행하지 않을 경우 released에서 기존의 selection list에서 eventTargetGraphicModel 제거
              }
            } else {
              // multiselection event
              // root group이 있고, event target이 group의 leaf graphic model인 경우
              // root group 이 선택 되지 않은 경우
              // eventTargetGraphicModel이 선택되어 있지 않은 경우
              // eslint-disable-next-line no-lonely-if
              if (hasRootGroupMemberInSelectionContainer === true) {
                // multiselection event
                // root group이 있고, event target이 group의 leaf graphic model인 경우
                // root group 이 선택 되지 않은 경우
                // eventTargetGraphicModel이 선택되어 있지 않은 경우
                // 같은 root group의 다른 leaf graphic model이 선택되어 있는 경우
                // pressed에서 기존의 selection list에서 eventTargetGraphicModel 추가
                // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
                graphicSelectionContainer.getGraphicModelSelections().forEach(graphicSelection => {
                  newSelectedGraphicModelList.push(graphicSelection.getModel());
                });

                newSelectedGraphicModelList.push(eventTargetGraphicModel);
                updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
                isSelectionRecentlyUpdated = true;
              } else {
                // multiselection event
                // root group이 있고, event target이 group의 leaf graphic model인 경우
                // root group 이 선택 되지 않은 경우
                // eventTargetGraphicModel이 선택되어 있지 않은 경우
                // 같은 root group의 다른 leaf graphic model이 선택되어 있지 않은 경우
                // pressed에서 기존의 selection list에서 root graphic model 만 추출 및 root group 추가
                // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
                const newSelectedGraphicModelSet = new Set<GraphicModel>();
                graphicSelectionContainer.getGraphicModelSelections().forEach(graphicSelection => {
                  const graphicModel = graphicSelection.getModel();
                  const rootGroupOfSelectedGraphicModel = getRootGroup(graphicModel);
                  if (rootGroupOfSelectedGraphicModel !== undefined) {
                    newSelectedGraphicModelSet.add(rootGroupOfSelectedGraphicModel);
                  } else {
                    newSelectedGraphicModelSet.add(graphicModel);
                  }
                });

                newSelectedGraphicModelSet.add(rootGroup);

                newSelectedGraphicModelSet.forEach(graphicModel => {
                  newSelectedGraphicModelList.push(graphicModel);
                });
                updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
                isSelectionRecentlyUpdated = true;
              }
            }
          }
        }
      } else {
        // multiselection event
        // root group이 없는 경우
        // eslint-disable-next-line no-lonely-if
        if (isSelectedGraphicModel === true) {
          // multiselection event
          // root group이 없는 경우
          // eventTargetGraphicModel이 이미 선택되어 있는 경우
          // pressed에서 selection 변경하지 않음
          // drag로 진행하지 않을 경우 기존 selection list에서 eventTargetGraphicModel 제거
        } else {
          // multiselection event
          // root group이 없는 경우
          // eventTargetGraphicModel이 선택되어 있지 않은 경우
          // pressed에서 기존의 selection list에서 root graphic model 만 추출 및 eventTargetGraphicModel이 추가
          // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
          const newSelectedGraphicModelSet = new Set<GraphicModel>();
          graphicSelectionContainer.getGraphicModelSelections().forEach(graphicSelection => {
            const graphicModel = graphicSelection.getModel();
            const rootGroupOfSelectedGraphicModel = getRootGroup(graphicModel);
            if (rootGroupOfSelectedGraphicModel !== undefined) {
              newSelectedGraphicModelSet.add(rootGroupOfSelectedGraphicModel);
            } else {
              newSelectedGraphicModelSet.add(graphicModel);
            }
          });

          newSelectedGraphicModelSet.add(eventTargetGraphicModel);

          newSelectedGraphicModelSet.forEach(graphicModel => {
            newSelectedGraphicModelList.push(graphicModel);
          });

          updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
          isSelectionRecentlyUpdated = true;
        }
      }
    } else {
      // 일반 click event
      // eslint-disable-next-line no-lonely-if
      if (rootGroup !== undefined) {
        // 일반 click event
        // root group 이 있는 경우
        if (eventTargetGraphicModel === rootGroup) {
          // 일반 click event
          // root group 이 있는 경우
          // eventTargetGraphicModel이 root group인 경우
          if (isRootGroupSelected === true) {
            // 일반 click event
            // root group 이 있는 경우
            // eventTargetGraphicModel이 root group인 경우
            // root group이 선택 된 경우
            // pressed에서 selection 변경하지 않음
            // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
          } else {
            // 일반 click event
            // root group 이 있는 경우
            // eventTargetGraphicModel이 root group인 경우
            // root group이 선택 되지 않음
            // pressed에서 root group만으로 selection 구성
            // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
            newSelectedGraphicModelList.push(rootGroup);
            updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
            isSelectionRecentlyUpdated = true;
          }
        } else {
          // 일반 click event
          // root group 이 있는 경우
          // eventTargetGraphicModel이 leaf graphic model인 경우
          // eslint-disable-next-line no-lonely-if
          if (isRootGroupSelected === true) {
            // 일반 click event
            // root group 이 있는 경우
            // eventTargetGraphicModel이 leaf graphic model인 경우
            // root group이 선택 된 경우
            if (graphicSelectionSize === 1) {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group 만 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않은 경우 released에서 eventTargetGraphicModel만으로 selection 구성
            } else {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group 및 다른 root graphic model이 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
            }
          } else {
            // 일반 click event
            // root group 이 있는 경우
            // eventTargetGraphicModel이 leaf graphic model인 경우
            // root group이 선택 되지 않은 경우
            // eslint-disable-next-line no-lonely-if
            if (isSelectedGraphicModel === true) {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group이 선택 되지 않은 경우
              // root group 아래의 leaf graphic model 이 선택 된 경우
              // event target이 이미 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
            } else if (hasRootGroupMemberInSelectionContainer === true) {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group이 선택 되지 않은 경우
              // root group 아래의 leaf graphic model 이 선택 된 경우
              // event target이 선택되지 않은 경우
              // pressed에서 eventTargetGraphicModel 만으로 새로운 selection 구성
              // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
              newSelectedGraphicModelList.push(eventTargetGraphicModel);
              updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
              isSelectionRecentlyUpdated = true;
            } else {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group이 선택 되지 않은 경우
              // root group 과 관련된 어떤 graphic model 도 선택되지 않은 경우
              // pressed에서 root group 만으로 새로운 selection 구성
              // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
              newSelectedGraphicModelList.push(rootGroup);
              updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
              isSelectionRecentlyUpdated = true;
            }
          }
        }
      } else {
        // 일반 click event
        // root group 이 없는 경우
        // eslint-disable-next-line no-lonely-if
        if (isSelectedGraphicModel === true) {
          // 일반 click event
          // root group 이 없는 경우
          // 이미 선택 된 graphic model 인 경우
          // pressed에서 selection 변경하지 않음
          // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
        } else {
          // 일반 click event
          // root group 이 없는 경우
          // 선택되지 않은 graphic model 인 경우
          // pressed에서 eventTargetGraphicModel 만으로 selection 구성
          // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
          newSelectedGraphicModelList.push(eventTargetGraphicModel);
          updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
          isSelectionRecentlyUpdated = true;
        }
      }
    }

    graphicEditInfoContainer.setIsSelectionRecentlyUpdated(isSelectionRecentlyUpdated);

    if (isSelectionRecentlyUpdated === false) {
      const graphicSelections = graphicSelectionContainer.getGraphicModelSelections();
      graphicSelections.forEach(graphicSelection => {
        newSelectedGraphicModelList.push(graphicSelection.getModel());
      });

      updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
    }
  }

  private updateSelectionOnMouseUp(event: MouseEvent, ctx: AppContext): void {
    const editableContext = ctx.getEditableContext();

    const selectionContainer = editableContext.getSelectionContainer();
    const graphicSelectionContainer = selectionContainer.getGraphicModelSelectionContainer();

    const graphicEditInfoContainer = editableContext.getGraphicEditInfoContainer();
    const eventTargetGraphicModel = graphicEditInfoContainer.getEventTargetGraphicModel();
    const newSelectedGraphicModelList = new Array<GraphicModel>();

    if (
      eventTargetGraphicModel === undefined ||
      graphicEditInfoContainer.getIsSelectionRecentlyUpdated() === true
    ) {
      return;
    }

    const graphicSelectionSize = graphicSelectionContainer.getSize();

    const isSelectedGraphicModel =
      graphicSelectionContainer.hasGraphicModelSelection(eventTargetGraphicModel);

    const isMultiSelectionEvent = graphicEditInfoContainer.getIsMultiSelectionEvent();

    const rootGroup: Nullable<GraphicModel> = getRootGroup(eventTargetGraphicModel);
    const isRootGroupSelected = rootGroup
      ? graphicSelectionContainer.hasGraphicModelSelection(rootGroup)
      : false;

    const hasRootGroupMemberInSelectionContainer = rootGroup
      ? graphicSelectionContainer.hasTargetRootGroupMember(rootGroup)
      : false;

    let isSelectionRecentlyUpdated = false;

    if (isMultiSelectionEvent === true) {
      // multiselection event의 경우 기본적으로 release에서 selection에 변경 함
      if (rootGroup !== undefined) {
        // multiselection event
        // root group이 있는 경우
        if (eventTargetGraphicModel === rootGroup) {
          // multiselection event
          // root group이 있고, event target이 root group인 경우
          if (isRootGroupSelected === true) {
            // multiselection event
            // root group이 있고, event target이 root group인 경우
            // root group이 선택 된 경우
            // pressed에서 selection 변경하지 않음
            // drag로 진행하지 않을 경우 released에서 해당 root group을 selected list에서 제거
            graphicSelectionContainer.getGraphicModelSelections().forEach(graphicSelection => {
              if (graphicSelection.getModel() !== rootGroup) {
                newSelectedGraphicModelList.push(graphicSelection.getModel());
              }
            });
            updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
            isSelectionRecentlyUpdated = true;
          } else {
            // multiselection event
            // root group이 있고, event target이 root group인 경우
            // root group이 선택 되지 않은 경우
            // root group의 leaf graphic model이 선택 된 상황에서
            // floating object를 선택하여 진입 한 경우 임
            // pressed에서 root group 만으로 selection 구성
            // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
          }
        } else {
          // multiselection event
          // root group이 있고, event target이 group의 leaf graphic model인 경우
          // eslint-disable-next-line no-lonely-if
          if (isRootGroupSelected === true) {
            // multiselection event
            // root group이 있고, event target이 group의 leaf graphic model인 경우
            // root group 이 선택 된 경우
            if (graphicSelectionSize === 1) {
              // multiselection event
              // root group이 있고, event target이 group의 leaf graphic model인 경우
              // root group 이 선택 된 경우
              // root group 만 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않을 경우 released에서 eventTargetGraphicModel만으로 selection 구성
              newSelectedGraphicModelList.push(eventTargetGraphicModel);
              updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
              isSelectionRecentlyUpdated = true;
            } else {
              // multiselection event
              // root group이 있고, event target이 group의 leaf graphic model인 경우
              // root group 이 선택 된 경우
              // root group 및 다른 root graphic model 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않을 경우 released에서 root group을 selected list에서 제거
              graphicSelectionContainer.getGraphicModelSelections().forEach(graphicSelection => {
                if (graphicSelection.getModel() !== rootGroup) {
                  newSelectedGraphicModelList.push(graphicSelection.getModel());
                }
              });
              updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
              isSelectionRecentlyUpdated = true;
            }
          } else {
            // multiselection event
            // root group이 있고, event target이 group의 leaf graphic model인 경우
            // root group 이 선택 되지 않은 경우
            // eslint-disable-next-line no-lonely-if
            if (isSelectedGraphicModel === true) {
              // multiselection event
              // root group이 있고, event target이 group의 leaf graphic model인 경우
              // root group 이 선택 되지 않은 경우
              // eventTargetGraphicModel이 선택되어 있는 경우
              if (graphicSelectionSize === 1) {
                // pressed에서 eventTargetGraphicModel을 기존의 selected list 에 추가
                // drag로 진행 할 경우 selection 변경하지 않음
                // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
                // eventTargetGraphicModel이 선택되어 있는 경우
                // eventTargetGraphicModel만 선택되어 있는 경우
                // pressed에서 selection 변경하지 않음
                // drag로 진행하지 않을 경우 released에서 root group만으로 selection 구성
                newSelectedGraphicModelList.push(rootGroup);
                updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
                isSelectionRecentlyUpdated = true;
              } else {
                // pressed에서 eventTargetGraphicModel을 기존의 selected list 에 추가
                // drag로 진행 할 경우 selection 변경하지 않음
                // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
                // eventTargetGraphicModel이 선택되어 있는 경우
                // eventTargetGraphicModel 및 같은 root group의 다른 leaf graphic model이 선택되어 있는 경우
                // pressed에서 selection 변경하지 않음
                // drag로 진행하지 않을 경우 released에서 기존의 selection list에서 eventTargetGraphicModel 제거
                graphicSelectionContainer.getGraphicModelSelections().forEach(graphicSelection => {
                  if (graphicSelection.getModel() !== eventTargetGraphicModel) {
                    newSelectedGraphicModelList.push(graphicSelection.getModel());
                  }
                });
                updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
                isSelectionRecentlyUpdated = true;
              }
            } else {
              // multiselection event
              // root group이 있고, event target이 group의 leaf graphic model인 경우
              // root group 이 선택 되지 않은 경우
              // eventTargetGraphicModel이 선택되어 있지 않은 경우
              // eslint-disable-next-line no-lonely-if
              if (hasRootGroupMemberInSelectionContainer === true) {
                // multiselection event
                // root group이 있고, event target이 group의 leaf graphic model인 경우
                // root group 이 선택 되지 않은 경우
                // eventTargetGraphicModel이 선택되어 있지 않은 경우
                // 같은 root group의 다른 leaf graphic model이 선택되어 있는 경우
                // pressed에서 selection 변경하지 기존의 selection list에서 eventTargetGraphicModel 추가
                // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
              } else {
                // multiselection event
                // root group이 있고, event target이 group의 leaf graphic model인 경우
                // root group 이 선택 되지 않은 경우
                // eventTargetGraphicModel이 선택되어 있지 않은 경우
                // 같은 root group의 다른 leaf graphic model이 선택되어 있지 않은 경우
                // pressed에서 기존의 selection list에서 root graphic model 만 추출 및 root group 추가
                // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
              }
            }
          }
        }
      } else {
        // multiselection event
        // root group이 없는 경우
        // eslint-disable-next-line no-lonely-if
        if (isSelectedGraphicModel === true) {
          // multiselection event
          // root group이 없는 경우
          // eventTargetGraphicModel이 이미 선택되어 있는 경우
          // pressed에서 selection 변경하지 않음
          // drag로 진행하지 않을 경우 기존 selection list에서 eventTargetGraphicModel 제거
          graphicSelectionContainer.getGraphicModelSelections().forEach(graphicSelection => {
            if (graphicSelection.getModel() !== eventTargetGraphicModel) {
              newSelectedGraphicModelList.push(graphicSelection.getModel());
            }
          });
          updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
          isSelectionRecentlyUpdated = true;
        } else {
          // multiselection event
          // root group이 없는 경우
          // eventTargetGraphicModel이 선택되어 있지 않은 경우
          // pressed에서 기존의 selection list에서 root graphic model 만 추출 및 eventTargetGraphicModel이 추가
          // drag로 진행하지 않을 경우 released에서 selection 변경하지 않음
        }
      }
    } else {
      // 일반 click event
      // eslint-disable-next-line no-lonely-if
      if (rootGroup !== undefined) {
        // 일반 click event
        // root group 이 있는 경우
        if (eventTargetGraphicModel === rootGroup) {
          // 일반 click event
          // root group 이 있는 경우
          // eventTargetGraphicModel이 root group인 경우
          if (isRootGroupSelected === true) {
            // 일반 click event
            // root group 이 있는 경우
            // eventTargetGraphicModel이 root group인 경우
            // root group이 선택 된 경우
            // pressed에서 selection 변경하지 않음
            // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
          } else {
            // 일반 click event
            // root group 이 있는 경우
            // eventTargetGraphicModel이 root group인 경우
            // root group이 선택 되지 않음
            // pressed에서 root group만으로 selection 구성
            // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
          }
        } else {
          // 일반 click event
          // root group 이 있는 경우
          // eventTargetGraphicModel이 leaf graphic model인 경우
          // eslint-disable-next-line no-lonely-if
          if (isRootGroupSelected === true) {
            // 일반 click event
            // root group 이 있는 경우
            // eventTargetGraphicModel이 leaf graphic model인 경우
            // root group이 선택 된 경우
            if (graphicSelectionSize === 1 && event.isRButton() === false) {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group 만 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않은 경우 released에서 eventTargetGraphicModel만으로 selection 구성
              newSelectedGraphicModelList.push(eventTargetGraphicModel);
              updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
              isSelectionRecentlyUpdated = true;
            } else {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group 및 다른 root graphic model이 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
            }
          } else {
            // 일반 click event
            // root group 이 있는 경우
            // eventTargetGraphicModel이 leaf graphic model인 경우
            // root group이 선택 되지 않은 경우
            // eslint-disable-next-line no-lonely-if
            if (isSelectedGraphicModel === true) {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group이 선택 되지 않은 경우
              // root group 아래의 leaf graphic model 이 선택 된 경우
              // event target이 이미 선택 된 경우
              // pressed에서 selection 변경하지 않음
              // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
            } else if (hasRootGroupMemberInSelectionContainer === true) {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group이 선택 되지 않은 경우
              // root group 아래의 leaf graphic model 이 선택 된 경우
              // event target이 선택되지 않은 경우
              // pressed에서 eventTargetGraphicModel 만으로 새로운 selection 구성
              // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
            } else {
              // 일반 click event
              // root group 이 있는 경우
              // eventTargetGraphicModel이 leaf graphic model인 경우
              // root group이 선택 되지 않은 경우
              // root group 과 관련된 어떤 graphic model 도 선택되지 않은 경우
              // pressed에서 root group 만으로 새로운 selection 구성
              // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
            }
          }
        }
      } else {
        // 일반 click event
        // root group 이 없는 경우
        // eslint-disable-next-line no-lonely-if
        if (isSelectedGraphicModel === true) {
          // 일반 click event
          // root group 이 없는 경우
          // 이미 선택 된 graphic model 인 경우
          // pressed에서 selection 변경하지 않음
          // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
        } else {
          // 일반 click event
          // root group 이 없는 경우
          // 선택되지 않은 graphic model 인 경우
          // pressed에서 eventTargetGraphicModel 만으로 selection 구성
          // drag로 진행하지 않은 경우 released에서 selection 변경하지 않음
        }
      }
    }

    if (isSelectionRecentlyUpdated === false) {
      graphicSelectionContainer.getGraphicModelSelections().forEach(graphicSelection => {
        newSelectedGraphicModelList.push(graphicSelection.getModel());
      });

      updateNewSelectionContainer(ctx, newSelectedGraphicModelList);
    }
  }
}

export default GraphicSelectionEventHandler;
