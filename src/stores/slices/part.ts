import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {rawPart, mPartId} from 'models/mPart';
import {reorder_array} from 'util/funcs';
import { mPointId } from 'models/mPoint';
import { mSideId } from 'models/mSide';

const part_adapter=createEntityAdapter<rawPart>();
const part_initialState:EntityStateWithLastID<rawPart>=part_adapter.getInitialState({
  last_id_number: 0
});
export const part_slice=createSlice({
  name: 'part',
  initialState: part_initialState,
  reducers: {
    add: (state,action:PayloadAction<rawPart>)=>{
      part_adapter.addOne(state,action.payload);
    },
    upsertOne: (state,action:PayloadAction<rawPart>)=>{
      part_adapter.upsertOne(state,action.payload);
    },
    removeOne: (state,action:PayloadAction<mPartId|undefined>)=>{
      if(action.payload===undefined) return;
      part_adapter.removeOne(state,action.payload.id);
    },
    removeAll: state=>{
      part_adapter.removeAll(state);
    },
    // Payload[a,b]->ID==aの要素にあるcontentsの末尾にbを追加する
    addChild: (state,action:PayloadAction<[mPartId|undefined,mPointId|undefined]>)=>{
      const [id, new_part]=action.payload;
      if(id===undefined||new_part===undefined) return;
      const entity=state.entities[id.id];
      if(entity===undefined) return;
      if(entity.contents===undefined) entity.contents=[];
      entity.contents.push(new_part);
    },
    // Payload[a,b,c]->ID===aの要素にあるcontentsに対してreorder_array(b,c)を実行する
    reorderChild: (state,action:PayloadAction<[mPartId|undefined,mPointId|undefined,mPointId|undefined|null]>)=>{
      const [id, child_target, before]=action.payload;
      if(id===undefined||child_target===undefined||before===undefined) return;
      const entity=state.entities[id.id];
      if(entity===undefined) return;
      const contents=entity.contents;
      if(contents!==undefined){
        entity.contents=reorder_array(contents,child_target,before);
      }
    },
    // Payload[a,b]->ID===aの要素の親をbに設定する
    setParent: (state,action:PayloadAction<[mPartId|undefined,mSideId|undefined]>)=>{
      const [id,parent]=action.payload;
      if(id===undefined||parent===undefined) return;
      const entity=state.entities[id.id];
      if(entity===undefined) return;
      entity.parent=parent;
    },
    incrementID: state=>{
      state.last_id_number++;
    },
    reset: ()=>part_initialState,
  }
});
export const part_selectors=part_adapter.getSelectors<RootState>(state=>state.part);
