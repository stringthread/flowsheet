import { RootState } from '../index';
import { EntityStateWithLastID } from './EntityStateWithLastID';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mClaim, is_mClaim } from 'models/mClaim';
import { mPoint } from 'models/mPoint';

const claim_adapter = createEntityAdapter<mClaim>();
const claim_initialState: EntityStateWithLastID<mClaim> = claim_adapter.getInitialState({
  last_id_number: 0,
});
export const claim_slice = createSlice({
  name: 'claim',
  initialState: claim_initialState,
  reducers: {
    add: (state, action: PayloadAction<mClaim>) => {
      claim_adapter.addOne(state, action.payload);
    },
    upsertOne: (state, action: PayloadAction<Pick<mClaim, 'id'> & Partial<mClaim>>) => {
      const evi = {
        ...state.entities[action.payload.id],
        ...action.payload,
      };
      if (is_mClaim(evi)) claim_adapter.upsertOne(state, evi);
    },
    removeOne: (state, action: PayloadAction<mClaim['id']>) => {
      claim_adapter.removeOne(state, action.payload);
    },
    removeAll: (state) => {
      claim_adapter.removeAll(state);
    },
    incrementID: (state) => {
      state.last_id_number++;
    },
    // Payload[a,b]->ID===aの要素の親をbに設定する
    setParent: (state, action: PayloadAction<[mClaim['id'], mPoint['id']]>) => {
      const [id, parent] = action.payload;
      const entity = state.entities[id];
      if (entity === undefined) return;
      entity.parent = parent;
    },
    reset: () => claim_initialState,
  },
});
export const claim_selectors = claim_adapter.getSelectors<RootState>((state) => state.claim);
