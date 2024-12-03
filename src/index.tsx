import AppComponent from 'component/frame/app/AppComponent';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppStore from 'store/AppStore';
import AppStoreProvider from 'store/AppStoreProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);

root.render(
  <AppStoreProvider value={new AppStore()}>
    <AppComponent />
  </AppStoreProvider>
);
