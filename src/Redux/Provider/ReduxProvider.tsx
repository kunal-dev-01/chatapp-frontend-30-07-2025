'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../Store/store';
import { Toaster } from 'react-hot-toast';
import Loader from '@/components/Layouts/Loader';

import {AuthCheck} from '../Hooks/CheckAuth';

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="min-h-screen flex items-center justify-center">
            <Loader />
          </div>
        } 
        persistor={persistor}
      >
          <AuthCheck>{children}</AuthCheck>
        <Toaster position="top-center" />
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;