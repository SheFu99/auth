'use client';
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { Store, AppStore } from '../lib/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = Store()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}

// export function ReduxProvider({
//         children,
// }:{
//     children:React.ReactNode;
// }){
//     return <Provider store={Store}>{children}</Provider>
// }