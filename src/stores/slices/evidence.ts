import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {mEvidence,is_mEvidence} from 'models/mEvidence';

const evidence_adapter=createEntityAdapter<mEvidence>();
const evidence_initialState:EntityStateWithLastID<mEvidence>=evidence_adapter.getInitialState({
  last_id_number: 0
});
export const evidence_slice=createSlice({
  name: 'evidence',
  initialState: evidence_initialState,
  reducers: {
    add: (state,action:PayloadAction<mEvidence>)=>{
      evidence_adapter.addOne(state,action.payload);
    },
    upsertOne: (state,action:PayloadAction<Pick<mEvidence,'id'>&Partial<mEvidence>>)=>{
      const evi={
        ...state.entities[action.payload.id],
        ...action.payload
      };
      if(is_mEvidence(evi)) evidence_adapter.upsertOne(state,evi);
    },
    removeOne: (state,action:PayloadAction<string>)=>{
      evidence_adapter.removeOne(state,action.payload);
    },
    removeAll: state=>{
      evidence_adapter.removeAll(state);
    },
    incrementID: state=>{
      state.last_id_number++;
    },
    // Payload[a,b]->ID===aの要素の親をbに設定する
    setParent: (state,action:PayloadAction<[string,string]>)=>{
      const [id,parent]=action.payload;
      const entity=state.entities[id];
      if(entity===undefined) return;
      entity.parent=parent;
    },
    reset: ()=>evidence_initialState,
  }
});
export const evidence_selectors=evidence_adapter.getSelectors<RootState>(state=>state.evidence);
