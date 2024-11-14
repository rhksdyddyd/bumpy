/**
 * 현재의 event state 를 나타내는 enum 입니다.
 * event state 에 따라 반응하는 event handler 의 종류와 순서가 다르며,
 * 어떤 event handler를 적용해야 하는지는 EventMapper 에서 관리합니다.
 */
enum EventState {
    INVALID = 0,
    IDLE,
    GRAPHIC_INSERT,
    GRAPHIC_MOVE,
    GRAPHIC_RESIZE,
    GRAPHIC_ROTATE,
}

export default EventState;
