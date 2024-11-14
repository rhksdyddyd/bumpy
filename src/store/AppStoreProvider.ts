import { createContext } from 'react';
import AppStore from 'store/AppStore';

/**
 * AppStore의 instance를 사용할 수 있도록 하는 context 입니다.
 */
export const AppStoreContext = createContext<AppStore>(new AppStore());
const AppStoreProvider = AppStoreContext.Provider;

export default AppStoreProvider;
