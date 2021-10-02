import {configureStore} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as rawUseSelector } from 'react-redux'

export const store=configureStore({
  reducer: {
  }
});

export type RootState=ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState>=rawUseSelector;
export type AppDispatch=typeof store.dispatch;
