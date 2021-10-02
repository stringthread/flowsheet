import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
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
    // Payload[a,b,c]->ID===aの要素にあるcontentsに対してreorder_array(b,c)を実行する
    reorderChild: (state,action:PayloadAction<[string,string,string|null]>)=>{
      const [id, child_target, before]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      const contents=entity.contents;
      if(contents!==undefined){
        entity.contents=reorder_array(contents,child_target,before);
      }
    }
  }
});
export const part_selectors=part_adapter.getSelectors<RootState>(state=>state.part);
