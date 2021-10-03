import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState,store} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {mMatch} from 'models/mMatch';

const match_adapter=createEntityAdapter<mMatch>();
const match_initialState:EntityStateWithLastID<mMatch>=match_adapter.getInitialState({
  last_id_number: 0
});
export const match_slice=createSlice({
  name: 'match',
  initialState: match_initialState,
  reducers: {
    add: (state,action:PayloadAction<mMatch>)=>{
      match_adapter.addOne(state,action.payload);
    },
    removeOne: (state,action:PayloadAction<string>)=>{
      match_adapter.removeOne(state,action.payload);
    },
    removeAll: state=>{
      match_adapter.removeAll(state);
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
    reset: ()=>match_initialState,
  }
});
export const match_selectors=match_adapter.getSelectors<RootState>(state=>state.match);

export const match_id_prefix='match_';
export const generate_match_id=()=>{
  const id_number=store.getState().match.last_id_number;
  store.dispatch(match_slice.actions.incrementID());
  return match_id_prefix+id_number.toString();
}
