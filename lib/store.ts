// store/store.ts

"use client"
import { configureStore } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import profileReducer from '../slices/profileSlices'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const Store = () =>
  configureStore({
    reducer: {
      profile: profileReducer,
    },
  });

  export const useAppDispatch=()=> useDispatch<AppDispatch>();
  export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export type AppStore = ReturnType<typeof Store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];