import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {mEvidence} from 'models/mEvidence';

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
    removeOne: (state,action:PayloadAction<string>)=>{
      evidence_adapter.removeOne(state,action.payload);
    },
    removeAll: state=>{
      evidence_adapter.removeAll(state);
    },
    incrementID: state=>{
      state.last_id_number++;
    },
  }
});
export const evidence_selectors=evidence_adapter.getSelectors<RootState>(state=>state.evidence);
