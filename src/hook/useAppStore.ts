import { useContext } from 'react';
import AppStore from 'store/AppStore';
import { AppStoreContext } from 'store/AppStoreProvider';

/**
 * AppStore 를 반환합니다.
 *
 * @returns AppStore
 */
const useAppStore = (): AppStore => useContext(AppStoreContext);

export default useAppStore;
