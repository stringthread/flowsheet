import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState,store} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {mPart} from 'models/mPart';
import {reorder_array} from 'util/funcs';

const part_adapter=createEntityAdapter<mPart>();
const part_initialState:EntityStateWithLastID<mPart>=part_adapter.getInitialState({
  last_id_number: 0
});
export const part_slice=createSlice({
  name: 'part',
  initialState: part_initialState,
  reducers: {
    add: (state,action:PayloadAction<mPart>)=>{
      part_adapter.addOne(state,action.payload);
    },
    removeOne: (state,action:PayloadAction<string>)=>{
      part_adapter.removeOne(state,action.payload);
    },
    removeAll: state=>{
      part_adapter.removeAll(state);
    },
    // Payload[a,b]->ID==aの要素にあるcontentsの末尾にbを追加する
    addChild: (state,action:PayloadAction<[string,string]>)=>{
      const [id, new_part]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      if(entity.contents===undefined) entity.contents=[];
      entity.contents.push(new_part);
    },
    // Payload[a,b,c]->ID===aの要素にあるcontentsに対してreorder_array(b,c)を実行する
    reorderChild: (state,action:PayloadAction<[string,string,string|null]>)=>{
      const [id, child_target, before]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      const contents=entity.contents;
      if(contents!==undefined){
        entity.contents=reorder_array(contents,child_target,before);
      }
    },
    incrementID: state=>{
      state.last_id_number++;
    },
    reset: ()=>part_initialState,
  }
});
export const part_selectors=part_adapter.getSelectors<RootState>(state=>state.part);

export const part_id_prefix='part_';
export const generate_part_id=()=>{
  const id_number=store.getState().part.last_id_number;
  store.dispatch(part_slice.actions.incrementID());
  return part_id_prefix+id_number.toString();
}
