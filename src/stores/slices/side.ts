import { RootState } from '../index';
import { EntityStateWithLastID } from './EntityStateWithLastID';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mMatch } from 'models/mMatch';
import { mPart } from 'models/mPart';
import { mSide } from 'models/mSide';

const side_adapter = createEntityAdapter<mSide>();
const side_initialState: EntityStateWithLastID<mSide> = side_adapter.getInitialState({
  last_id_number: 0,
});
export const side_slice = createSlice({
  name: 'side',
  initialState: side_initialState,
  reducers: {
    add: (state, action: PayloadAction<mSide>) => {
      side_adapter.addOne(state, action.payload);
    },
    upsertOne: (state, action: PayloadAction<mSide>) => {
      side_adapter.upsertOne(state, action.payload);
    },
    removeOne: (state, action: PayloadAction<string>) => {
      side_adapter.removeOne(state, action.payload);
    },
    removeAll: (state) => {
      side_adapter.removeAll(state);
    },
    // Payload[a,b]->ID==aの要素にあるcontentsの末尾にbを追加する
    addChild: (state, action: PayloadAction<[mSide['id'], mPart['id']]>) => {
      const [id, new_part] = action.payload;
      const entity = state.entities[id];
      if (entity === undefined) return;
      if (entity.contents === undefined) entity.contents = [];
      entity.contents.push(new_part);
    },
    // Payload[a,b]->ID===aの要素の親をbに設定する
    setParent: (state, action: PayloadAction<[mSide['id'], mMatch['id']]>) => {
      const [id, parent] = action.payload;
      const entity = state.entities[id];
      if (entity === undefined) return;
      entity.parent = parent;
    },
    incrementID: (state) => {
      state.last_id_number++;
    },
    reset: () => side_initialState,
  },
});
export const side_selectors = side_adapter.getSelectors<RootState>((state) => state.side);
