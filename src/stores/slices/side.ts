import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState,store} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {mSide} from 'models/mSide';

const side_adapter=createEntityAdapter<mSide>();
const side_initialState:EntityStateWithLastID<mSide>=side_adapter.getInitialState({
  last_id_number: 0
});
export const side_slice=createSlice({
  name: 'side',
  initialState: side_initialState,
  reducers: {
    add: (state,action:PayloadAction<mSide>)=>{
      side_adapter.addOne(state,action.payload);
    },
    removeOne: (state,action:PayloadAction<string>)=>{
      side_adapter.removeOne(state,action.payload);
    },
    removeAll: state=>{
      side_adapter.removeAll(state);
    },
    // Payload[a,b]->ID==aの要素にあるcontentsの末尾にbを追加する
    addChild: (state,action:PayloadAction<[string,string]>)=>{
      const [id, new_part]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      if(entity.contents===undefined) entity.contents=[];
      entity.contents.push(new_part);
    },
    incrementID: state=>{
      state.last_id_number++;
    },
    reset: ()=>side_initialState,
  }
});
export const side_selectors=side_adapter.getSelectors<RootState>(state=>state.side);
