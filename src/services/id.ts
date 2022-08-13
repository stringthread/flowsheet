import {ID_TYPE, evidence_id_prefix, claim_id_prefix, point_id_prefix, part_id_prefix, side_id_prefix, match_id_prefix} from '../stores/ids/id_generators'
import { baseModel } from 'models/baseModel';
import { mMatchSignature } from 'models/mMatch';
import { mSideSignature } from 'models/mSide';
import { mPartSignature } from 'models/mPart';
import { mPointSignature } from 'models/mPoint';
import { mEvidenceSignature } from 'models/mEvidence';
import { store } from 'stores';
import { mClaimSignature } from 'models/mClaim';

export const id_is_mMatch=(id:ID_TYPE):boolean=>{
  return id.startsWith(match_id_prefix);
}
export const id_is_mSide=(id:ID_TYPE):boolean=>{
  return id.startsWith(side_id_prefix);
}
export const id_is_mPart=(id:ID_TYPE):boolean=>{
  return id.startsWith(part_id_prefix);
}
export const id_is_mPoint=(id:ID_TYPE):boolean=>{
  return id.startsWith(point_id_prefix);
}
export const id_is_mClaim=(id:ID_TYPE):boolean=>{
  return id.startsWith(claim_id_prefix);
}
export const id_is_mEvidence=(id:ID_TYPE):boolean=>{
  return id.startsWith(evidence_id_prefix);
}

export const id_to_type=(id:ID_TYPE)=>{
  if(id_is_mMatch(id)) return mMatchSignature;
  if(id_is_mSide(id)) return mSideSignature;
  if(id_is_mPart(id)) return mPartSignature;
  if(id_is_mPoint(id)) return mPointSignature;
  if(id_is_mClaim(id)) return mClaimSignature;
  if(id_is_mEvidence(id)) return mEvidenceSignature;
};
export const type_to_store={
  [mMatchSignature]: ()=>store.getState().match,
  [mSideSignature]: ()=>store.getState().side,
  [mPartSignature]: ()=>store.getState().part,
  [mPointSignature]: ()=>store.getState().point,
  [mClaimSignature]: ()=>store.getState().claim,
  [mEvidenceSignature]: ()=>store.getState().evidence,
};
export const id_to_store=(id:ID_TYPE)=>{
  const type=id_to_type(id);
  if(type!==undefined) return type_to_store[type];
}

// 引数idに対応する要素がなければundefined、idの要素に親がなければnull
export const get_parent_id=(id:ID_TYPE):ID_TYPE|null|undefined=>{
  const type_signature = id_to_type(id);
  if(type_signature===undefined||type_signature===mMatchSignature) return null;
  return type_to_store[type_signature]().entities[id]?.parent;
};
export const next_content_id=(id:ID_TYPE):ID_TYPE|undefined=>{
  const parent_id=get_parent_id(id);
  if(parent_id===null||parent_id===undefined) return;
  const parent_type=id_to_type(parent_id);
  if(parent_type===undefined) return;
  const sibling_list=type_to_store[parent_type]().entities[parent_id]?.contents;
  if(!Array.isArray(sibling_list)) return;
  const item_index=sibling_list.findIndex(v=>v===id);
  if(item_index===-1||item_index>=sibling_list.length-1) return;
  return sibling_list[item_index+1];
}
