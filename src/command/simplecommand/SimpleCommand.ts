/**
 * store 를 제어하는 가장 작은 단위입니다.
 * 여러 simple command 가 모여 하나의 동작이 되며, undo/redo 가 가능합니다.
 */
abstract class SimpleCommand {
    /**
     * Simple command 의 do 동작입니다.
     */
    public abstract apply(): void;

    /**
     * Simple command 의 undo 동작입니다.
     */
    public abstract unapply(): void;

    /**
     * Simple command 의 redo 동작입니다.
     */
    public abstract reapply(): void;
}

export default SimpleCommand;
