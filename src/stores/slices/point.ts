import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {mPoint} from 'models/mPoint';
import {reorder_array} from 'util/funcs';

const point_adapter=createEntityAdapter<mPoint>();
const point_initialState:EntityStateWithLastID<mPoint>=point_adapter.getInitialState({
  last_id_number: 0
});
export const point_slice=createSlice({
  name: 'point',
  initialState: point_initialState,
  reducers: {
    add: (state,action:PayloadAction<mPoint>)=>{
      point_adapter.addOne(state,action.payload);
    },
    removeOne: (state,action:PayloadAction<string>)=>{
      point_adapter.removeOne(state,action.payload);
    },
    removeAll: state=>{
      point_adapter.removeAll(state);
    },
    // Payload[a,b,c]->ID===aの要素にあるcontentsに対してreorder_array(b,c)を実行する
    reorderChild: (state,action:PayloadAction<[string,string,string|null]>)=>{
      const [id, child_target, before]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      const contents=entity.contents;
      if(contents instanceof Array){
        entity.contents=reorder_array(contents,child_target,before);
      }
    }
  }
});
export const point_selectors=point_adapter.getSelectors<RootState>(state=>state.point);
