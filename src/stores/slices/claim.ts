import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {EntityStateWithLastID} from './EntityStateWithLastID';
import {rawClaim, mClaimId, is_rawClaim} from 'models/mClaim';
import { mPointId } from 'models/mPoint';

const claim_adapter=createEntityAdapter<rawClaim>();
const claim_initialState:EntityStateWithLastID<rawClaim>=claim_adapter.getInitialState({
  last_id_number: 0
});
export const claim_slice=createSlice({
  name: 'claim',
  initialState: claim_initialState,
  reducers: {
    add: (state,action:PayloadAction<rawClaim>)=>{
      claim_adapter.addOne(state,action.payload);
    },
    upsertOne: (state,action:PayloadAction<Pick<rawClaim,'id'>&Partial<rawClaim>>)=>{
      const new_obj={
        ...state.entities[action.payload.id.id],
        ...action.payload
      };
      if(is_rawClaim(new_obj)) claim_adapter.upsertOne(state,new_obj);
    },
    removeOne: (state,action:PayloadAction<mClaimId>)=>{
      claim_adapter.removeOne(state,action.payload.id);
    },
    removeAll: state=>{
      claim_adapter.removeAll(state);
    },
    incrementID: state=>{
      state.last_id_number++;
    },
    // Payload[a,b]->ID===aの要素の親をbに設定する
    setParent: (state,action:PayloadAction<[mClaimId,mPointId]>)=>{
      const [id,parent]=action.payload;
      const entity=state.entities[id.id];
      if(entity===undefined) return;
      entity.parent=parent;
    },
    reset: ()=>claim_initialState,
  }
});
export const claim_selectors=claim_adapter.getSelectors<RootState>(state=>state.claim);
