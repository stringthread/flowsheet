import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {rawEvidence,is_rawEvidence, mEvidenceId} from 'models/mEvidence';
import { mPointId } from 'models/mPoint';

const evidence_adapter=createEntityAdapter<rawEvidence>();
const evidence_initialState:EntityStateWithLastID<rawEvidence>=evidence_adapter.getInitialState({
  last_id_number: 0
});
export const evidence_slice=createSlice({
  name: 'evidence',
  initialState: evidence_initialState,
  reducers: {
    add: (state,action:PayloadAction<rawEvidence>)=>{
      evidence_adapter.addOne(state,action.payload);
    },
    upsertOne: (state,action:PayloadAction<Pick<rawEvidence,'id_obj'>&Partial<rawEvidence>>)=>{
      const evi={
        ...state.entities[action.payload.id_obj.id],
        id: action.payload.id_obj.id,
        ...action.payload
      };
      if(is_rawEvidence(evi)) evidence_adapter.upsertOne(state,evi);
    },
    removeOne: (state,action:PayloadAction<mEvidenceId|undefined>)=>{
      if(action.payload===undefined) return;
      evidence_adapter.removeOne(state,action.payload.id);
    },
    removeAll: state=>{
      evidence_adapter.removeAll(state);
    },
    incrementID: state=>{
      state.last_id_number++;
    },
    // Payload[a,b]->ID===aの要素の親をbに設定する
    setParent: (state,action:PayloadAction<[mEvidenceId|undefined,mPointId|undefined]>)=>{
      const [id,parent]=action.payload;
      if(id===undefined||parent===undefined) return;
      const entity=state.entities[id.id];
      if(entity===undefined) return;
      entity.parent=parent;
    },
    reset: ()=>evidence_initialState,
  }
});
export const evidence_selectors=evidence_adapter.getSelectors<RootState>(state=>state.evidence);
