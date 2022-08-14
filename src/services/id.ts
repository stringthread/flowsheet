import { ID_TYPE, modelSignatures, MODEL_TYPE } from 'models';
import { mMatchSignature, is_mMatchId, mMatchId, mMatch } from 'models/mMatch';
import { mSideSignature, is_mSideId, mSideId, mSide } from 'models/mSide';
import { mPartSignature, is_mPartId, mPartId, mPart } from 'models/mPart';
import { mPointSignature, is_mPointId, mPointId, mPoint, PointChildId } from 'models/mPoint';
import { mClaimSignature, is_mClaimId, mClaimId, mClaim } from 'models/mClaim';
import { mEvidenceSignature, is_mEvidenceId, mEvidenceId, mEvidence } from 'models/mEvidence';
import { store } from 'stores';
import { match_slice } from 'stores/slices/match';
import { side_slice } from 'stores/slices/side';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { claim_slice } from 'stores/slices/claim';
import { evidence_slice } from 'stores/slices/evidence';
import { assertNever } from 'util/utilityTypes';

export function id_to_type(id: mMatchId): typeof mMatchSignature;
export function id_to_type(id: mSideId): typeof mSideSignature;
export function id_to_type(id: mPartId): typeof mPartSignature;
export function id_to_type(id: mPointId): typeof mPointSignature;
export function id_to_type(id: mClaimId): typeof mClaimSignature;
export function id_to_type(id: mEvidenceId): typeof mEvidenceSignature;
export function id_to_type(id: ID_TYPE): modelSignatures;
export function id_to_type(id:ID_TYPE){
  if(is_mMatchId(id)) return mMatchSignature;
  if(is_mSideId(id)) return mSideSignature;
  if(is_mPartId(id)) return mPartSignature;
  if(is_mPointId(id)) return mPointSignature;
  if(is_mClaimId(id)) return mClaimSignature;
  if(is_mEvidenceId(id)) return mEvidenceSignature;
  assertNever(id);
};
export const type_to_store={
  [mMatchSignature]: ()=>store.getState().match,
  [mSideSignature]: ()=>store.getState().side,
  [mPartSignature]: ()=>store.getState().part,
  [mPointSignature]: ()=>store.getState().point,
  [mClaimSignature]: ()=>store.getState().claim,
  [mEvidenceSignature]: ()=>store.getState().evidence,
};
export function id_to_store(id: mMatchId): typeof type_to_store[typeof mMatchSignature];
export function id_to_store(id: mSideId): typeof type_to_store[typeof mSideSignature];
export function id_to_store(id: mPartId): typeof type_to_store[typeof mPartSignature];
export function id_to_store(id: mPointId): typeof type_to_store[typeof mPointSignature];
export function id_to_store(id: mClaimId): typeof type_to_store[typeof mClaimSignature];
export function id_to_store(id: mEvidenceId): typeof type_to_store[typeof mEvidenceSignature];
export function id_to_store(id: ID_TYPE): typeof type_to_store[modelSignatures];
export function id_to_store(id:ID_TYPE){
  const type=id_to_type(id);
  return type_to_store[type];
}

export const type_to_slice={
  [mMatchSignature]: match_slice,
  [mSideSignature]: side_slice,
  [mPartSignature]: part_slice,
  [mPointSignature]: point_slice,
  [mClaimSignature]: claim_slice,
  [mEvidenceSignature]: evidence_slice,
};
export function id_to_slice(id: mMatchId): typeof type_to_slice[typeof mMatchSignature];
export function id_to_slice(id: mSideId): typeof type_to_slice[typeof mSideSignature];
export function id_to_slice(id: mPartId): typeof type_to_slice[typeof mPartSignature];
export function id_to_slice(id: mPointId): typeof type_to_slice[typeof mPointSignature];
export function id_to_slice(id: mClaimId): typeof type_to_slice[typeof mClaimSignature];
export function id_to_slice(id: mEvidenceId): typeof type_to_slice[typeof mEvidenceSignature];
export function id_to_slice(id: ID_TYPE): typeof type_to_slice[modelSignatures];
export function id_to_slice(id:ID_TYPE){
  const type=id_to_type(id);
  return type_to_slice[type];
}

export function get_from_id(id: mMatchId): mMatch;
export function get_from_id(id: mSideId): mSide;
export function get_from_id(id: mPartId): mPart;
export function get_from_id(id: mPointId): mPoint;
export function get_from_id(id: mClaimId): mClaim;
export function get_from_id(id: mEvidenceId): mEvidence;
export function get_from_id(id: ID_TYPE): MODEL_TYPE;
export function get_from_id(id:ID_TYPE){
  const type_store=id_to_store(id);
  if(type_store===undefined) return;
  return type_store().entities[id];
};

// 引数idに対応する要素がなければundefined、idの要素に親がなければnull
export function get_parent_id(id: mMatchId): null|undefined;
export function get_parent_id(id: mSideId): mMatchId|null|undefined;
export function get_parent_id(id: mPartId): mSideId|null|undefined;
export function get_parent_id(id: mPointId): mPartId|mPointId|null|undefined;
export function get_parent_id(id: mClaimId): mPointId|null|undefined;
export function get_parent_id(id: mEvidenceId): mPointId|null|undefined;
export function get_parent_id(id: ID_TYPE): ID_TYPE|null|undefined;
export function get_parent_id(id:ID_TYPE):ID_TYPE|null|undefined{
  const type_signature = id_to_type(id);
  if(type_signature===undefined||type_signature===mMatchSignature) return null;
  return type_to_store[type_signature]().entities[id]?.parent;
};

export function next_content_id(id: mMatchId): mMatchId;
export function next_content_id(id: mSideId): mSideId|undefined;
export function next_content_id(id: mPartId): mPartId|undefined;
export function next_content_id(id: mPointId): PointChildId|undefined;
export function next_content_id(id: mClaimId): PointChildId|undefined;
export function next_content_id(id: mEvidenceId): PointChildId|undefined;
export function next_content_id(id: ID_TYPE): ID_TYPE|undefined;
export function next_content_id(id:ID_TYPE):ID_TYPE|undefined{
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
