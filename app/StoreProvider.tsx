'use client';
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from '../lib/store'
import { PersistGate } from 'redux-persist/integration/react';

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  

  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    {children}
    </PersistGate>
  </Provider>)
}

// export function ReduxProvider({
//         children,
// }:{
//     children:React.ReactNode;
// }){
//     return <Provider store={Store}>{children}</Provider>
// }