import { boundMethod } from 'autobind-decorator';

/**
 * node의 id를 발급하는 container입니다.
 */
class IdContainer {
    /**
     * IdContainer 내부에서 id 발급을 위해 관리하는 변수
     */
    private id;

    /**
     * 생성자
     */
    constructor() {
        this.id = 0;
    }

    /**
     * id를 발급합니다.
     *
     * @returns 새롭게 사용할 수 있는 id
     */
    @boundMethod
    public generateId(): number {
        return this.id++;
    }
}

export default new IdContainer();
