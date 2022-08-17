import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {rawMatch, mMatchId} from 'models/mMatch';
import { mSideId } from 'models/mSide';

const match_adapter=createEntityAdapter<rawMatch>();
const match_initialState:EntityStateWithLastID<rawMatch>=match_adapter.getInitialState({
  last_id_number: 0
});
export const match_slice=createSlice({
  name: 'match',
  initialState: match_initialState,
  reducers: {
    add: (state,action:PayloadAction<rawMatch>)=>{
      match_adapter.addOne(state,action.payload);
    },
    upsertOne: (state,action:PayloadAction<rawMatch>)=>{
      match_adapter.upsertOne(state,action.payload);
    },
    removeOne: (state,action:PayloadAction<mMatchId|undefined>)=>{
      if(action.payload===undefined) return;
      match_adapter.removeOne(state,action.payload.id);
    },
    removeAll: state=>{
      match_adapter.removeAll(state);
    },
    // Payload[a,b]->ID==aの要素にあるcontentsの末尾にbを追加する
    addChild: (state,action:PayloadAction<[mMatchId|undefined,mSideId|undefined]>)=>{
      const [id, new_part]=action.payload;
      if(id===undefined||new_part===undefined) return;
      const entity=state.entities[id.id];
      if(entity===undefined) return;
      if(entity.contents===undefined) entity.contents=[];
      entity.contents.push(new_part);
    },
    incrementID: state=>{
      state.last_id_number++;
    },
    reset: ()=>match_initialState,
  }
});
export const match_selectors=match_adapter.getSelectors<RootState>(state=>state.match);
