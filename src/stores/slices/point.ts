import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {rawPoint, mPointId, is_rawPoint, PointChildId} from 'models/mPoint';
import {reorder_array} from 'util/funcs';
import { mPartId } from 'models/mPart';

const point_adapter=createEntityAdapter<rawPoint>();
const point_initialState:EntityStateWithLastID<rawPoint>=point_adapter.getInitialState({
  last_id_number: 0
});
export const point_slice=createSlice({
  name: 'point',
  initialState: point_initialState,
  reducers: {
    add: (state,action:PayloadAction<rawPoint>)=>{
      point_adapter.addOne(state,action.payload);
    },
    upsertOne: (state,action:PayloadAction<Pick<rawPoint,'id_obj'>&Partial<rawPoint>>)=>{
      const point={
        ...state.entities[action.payload.id_obj.id],
        id: action.payload.id_obj.id,
        ...action.payload
      };
      if(is_rawPoint(point)) point_adapter.upsertOne(state,point);
    },
    removeOne: (state,action:PayloadAction<mPointId|undefined>)=>{
      if(action.payload===undefined) return;
      point_adapter.removeOne(state,action.payload.id);
    },
    removeAll: state=>{
      point_adapter.removeAll(state);
    },
    // Payload[a,b]: ID==aの要素にあるcontentsの末尾にbを追加する
    addChild: (state,action:PayloadAction<[mPointId|undefined,PointChildId|undefined]>)=>{
      const [id, new_part]=action.payload;
      if(id===undefined||new_part===undefined) return;
      const entity=state.entities[id.id];
      if(entity===undefined||typeof entity.contents==='string') return;
      if(entity.contents===undefined) entity.contents=[];
      entity.contents.push(new_part);
    },
    // Payload[a,b,c]->ID===aの要素にあるcontentsに対してreorder_array(b,c)を実行する
    reorderChild: (state,action:PayloadAction<[mPointId|undefined,PointChildId|undefined,PointChildId|undefined|null]>)=>{
      const [id, child_target, before]=action.payload;
      if(id===undefined||child_target===undefined||before===undefined) return;
      const entity=state.entities[id.id];
      if(entity===undefined) return;
      const contents=entity.contents;
      if(!(contents instanceof Array)) return;
      entity.contents=reorder_array(contents,child_target,before,(e,t)=>e===t);
    },
    // Payload[a,b]->ID===aの要素の親をbに設定する
    setParent: (state,action:PayloadAction<[mPointId|undefined,mPointId|mPartId|undefined]>)=>{
      const [id,parent]=action.payload;
      if(id===undefined||parent===undefined) return;
      const entity=state.entities[id.id];
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
