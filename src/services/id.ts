import { ID_TYPE } from 'models/baseModel';
import { mMatchSignature, is_mMatchId } from 'models/mMatch';
import { mSideSignature, is_mSideId } from 'models/mSide';
import { mPartSignature, is_mPartId } from 'models/mPart';
import { mPointSignature, is_mPointId } from 'models/mPoint';
import { mClaimSignature, is_mClaimId } from 'models/mClaim';
import { mEvidenceSignature, is_mEvidenceId } from 'models/mEvidence';
import { store } from 'stores';
import { match_slice } from 'stores/slices/match';
import { side_slice } from 'stores/slices/side';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { claim_slice } from 'stores/slices/claim';
import { evidence_slice } from 'stores/slices/evidence';

export const id_to_type=(id:ID_TYPE)=>{
  if(is_mMatchId(id)) return mMatchSignature;
  if(is_mSideId(id)) return mSideSignature;
  if(is_mPartId(id)) return mPartSignature;
  if(is_mPointId(id)) return mPointSignature;
  if(is_mClaimId(id)) return mClaimSignature;
  if(is_mEvidenceId(id)) return mEvidenceSignature;
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
export const type_to_slice={
  [mMatchSignature]: match_slice,
  [mSideSignature]: side_slice,
  [mPartSignature]: part_slice,
  [mPointSignature]: point_slice,
  [mClaimSignature]: claim_slice,
  [mEvidenceSignature]: evidence_slice,
};
export const id_to_slice=(id:ID_TYPE)=>{
  const type=id_to_type(id);
  if(type!==undefined) return type_to_slice[type];
}

export const get_from_id=(id:ID_TYPE)=>{
  const type_store=id_to_store(id);
  if(type_store===undefined) return;
  return type_store().entities[id];
};

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
