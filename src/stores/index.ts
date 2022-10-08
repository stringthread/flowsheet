import { claim_slice } from './slices/claim';
import { evidence_slice } from './slices/evidence';
import { match_slice } from './slices/match';
import { part_slice } from './slices/part';
import { point_slice } from './slices/point';
import { side_slice } from './slices/side';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as rawUseSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    evidence: evidence_slice.reducer,
    claim: claim_slice.reducer,
    point: point_slice.reducer,
    part: part_slice.reducer,
    side: side_slice.reducer,
    match: match_slice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
export type AppDispatch = typeof store.dispatch;
