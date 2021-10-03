import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState,store} from '../index';
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
    // Payload[a,b,c]->ID==aの要素にあるcontentsの末尾に[b,c]を追加する
    addChild: (state,action:PayloadAction<[string,string,boolean]>)=>{
      const [id, ...new_part]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined||typeof entity.contents==='string') return;
      if(entity.contents===undefined) entity.contents=[];
      entity.contents.push(new_part);
    },
    // Payload[a,b,c]->ID===aの要素にあるcontentsに対してreorder_array(b,c)を実行する
    reorderChild: (state,action:PayloadAction<[string,string,string|null]>)=>{
      const [id, child_target, before]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      const contents=entity.contents;
      if(!(contents instanceof Array)) return;
      entity.contents=reorder_array(contents,child_target,before,(e,t)=>e[0]===t);
    },
    incrementID: state=>{
      state.last_id_number++;
    },
  }
});
export const point_selectors=point_adapter.getSelectors<RootState>(state=>state.point);

export const point_id_prefix='point_';
export const generate_point_id=()=>{
  const id_number=store.getState().evidence.last_id_number;
  store.dispatch(point_slice.actions.incrementID());
  return point_id_prefix+id_number.toString();
}
