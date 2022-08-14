import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {is_mPoint, mPoint,mPointId,mPointSignature, PointChildId} from 'models/mPoint';
import {reorder_array} from 'util/funcs';
import { mPartId } from 'models/mPart';

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
    upsertOne: (state,action:PayloadAction<Pick<mPoint,'id'>&Partial<mPoint>>)=>{
      const point={
        ...state.entities[action.payload.id],
        ...action.payload
      };
      if(is_mPoint(point)) point_adapter.upsertOne(state,point);
    },
    removeOne: (state,action:PayloadAction<mPointId>)=>{
      point_adapter.removeOne(state,action.payload);
    },
    removeAll: state=>{
      point_adapter.removeAll(state);
    },
    // Payload[a,b]: ID==aの要素にあるcontentsの末尾にbを追加する
    addChild: (state,action:PayloadAction<[mPointId,PointChildId]>)=>{
      const [id, new_part]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined||typeof entity.contents==='string') return;
      if(entity.contents===undefined) entity.contents=[];
      entity.contents.push(new_part);
    },
    // Payload[a,b,c]->ID===aの要素にあるcontentsに対してreorder_array(b,c)を実行する
    reorderChild: (state,action:PayloadAction<[mPointId,PointChildId,PointChildId|null]>)=>{
      const [id, child_target, before]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      const contents=entity.contents;
      if(!(contents instanceof Array)) return;
      entity.contents=reorder_array(contents,child_target,before,(e,t)=>e===t);
    },
    // Payload[a,b]->ID===aの要素の親をbに設定する
    setParent: (state,action:PayloadAction<[mPointId,mPartId]>)=>{
      const [id,parent]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      entity.parent=parent;
    },
    incrementID: state=>{
      state.last_id_number++;
    },
    reset: ()=>point_initialState,
  }
});
export const point_selectors=point_adapter.getSelectors<RootState>(state=>state.point);
