import {configureStore} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as rawUseSelector } from 'react-redux'
import {evidence_slice} from './slices/evidence';
import {point_slice} from './slices/point';

export const store=configureStore({
  reducer: {
    evidence: evidence_slice.reducer,
    point: point_slice.reducer,
  }
});

export type RootState=ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState>=rawUseSelector;
export type AppDispatch=typeof store.dispatch;
