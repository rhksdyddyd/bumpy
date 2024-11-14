/**
 * command의 종류를 나타내는 enum 입니다.
 */
enum CommandEnum {
    INVALID = 0,
    GRAPHIC_INSERT_SET_UP,
    GRAPHIC_INSERT,
    TEST_DEFAULT,
    UNDO,
    REDO,
}

export default CommandEnum;
