import { baseModel } from 'models/baseModel';
import { id_is_mMatch, match_id_prefix, mMatch, mMatchSignature } from 'models/mMatch';
import { id_is_mSide, mSide, mSideSignature, side_id_prefix } from 'models/mSide';
import { id_is_mPart, mPart, mPartSignature, part_id_prefix } from 'models/mPart';
import { id_is_mPoint, mPoint, mPointSignature, PointChild, PointParent, point_id_prefix } from 'models/mPoint';
import { evidence_id_prefix, id_is_mEvidence, mEvidence, mEvidenceSignature } from 'models/mEvidence';
import { store } from 'stores';
import { claim_id_prefix, id_is_mClaim, mClaim, mClaimSignature } from 'models/mClaim';
import { match_slice } from 'stores/slices/match';
import { side_slice } from 'stores/slices/side';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { claim_slice } from 'stores/slices/claim';
import { evidence_slice } from 'stores/slices/evidence';
import { ID_TYPE, MODEL_TYPE, PREFIX_TYPE, SIGNATURE_TYPE } from 'models';
import { assertNever } from 'util/utilityTypes';

export const id_to_type: {
  (id: mMatch['id']): typeof mMatchSignature;
  (id: mSide['id']): typeof mSideSignature;
  (id: mPart['id']): typeof mPartSignature;
  (id: mPoint['id']): typeof mPointSignature;
  (id: mClaim['id']): typeof mClaimSignature;
  (id: mEvidence['id']): typeof mEvidenceSignature;
  (id: PointParent['id']): PointParent['type_signature'];
  (id: PointChild['id']): PointChild['type_signature'];
  (id: ID_TYPE): SIGNATURE_TYPE;
} = (id:ID_TYPE): any=>{
  if(id_is_mMatch(id)) return mMatchSignature;
  if(id_is_mSide(id)) return mSideSignature;
  if(id_is_mPart(id)) return mPartSignature;
  if(id_is_mPoint(id)) return mPointSignature;
  if(id_is_mClaim(id)) return mClaimSignature;
  if(id_is_mEvidence(id)) return mEvidenceSignature;
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
export const id_to_store: {
  (id: mMatch['id']): typeof type_to_store[typeof mMatchSignature];
  (id: mSide['id']): typeof type_to_store[typeof mSideSignature];
  (id: mPart['id']): typeof type_to_store[typeof mPartSignature];
  (id: mPoint['id']): typeof type_to_store[typeof mPointSignature];
  (id: mClaim['id']): typeof type_to_store[typeof mClaimSignature];
  (id: mEvidence['id']): typeof type_to_store[typeof mEvidenceSignature];
  (id: PointParent['id']): typeof type_to_store[PointParent['type_signature']];
  (id: PointChild['id']): typeof type_to_store[PointChild['type_signature']];
  (id: ID_TYPE): typeof type_to_store[SIGNATURE_TYPE];
} = (id: ID_TYPE): any=>{
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
export const id_to_slice: {
  (id: mMatch['id']): typeof type_to_slice[typeof mMatchSignature];
  (id: mSide['id']): typeof type_to_slice[typeof mSideSignature];
  (id: mPart['id']): typeof type_to_slice[typeof mPartSignature];
  (id: mPoint['id']): typeof type_to_slice[typeof mPointSignature];
  (id: mClaim['id']): typeof type_to_slice[typeof mClaimSignature];
  (id: mEvidence['id']): typeof type_to_slice[typeof mEvidenceSignature];
  (id: PointParent['id']): typeof type_to_slice[PointParent['type_signature']];
  (id: PointChild['id']): typeof type_to_slice[PointChild['type_signature']];
  (id: ID_TYPE): typeof type_to_slice[SIGNATURE_TYPE];
} = (id:ID_TYPE): any=>{
  const type=id_to_type(id);
  if(type!==undefined) return type_to_slice[type];
}

export const get_from_id: {
  (id: mMatch['id']): mMatch|undefined;
  (id: mSide['id']): mSide|undefined;
  (id: mPart['id']): mPart|undefined;
  (id: mPoint['id']): mPoint|undefined;
  (id: mClaim['id']): mClaim|undefined;
  (id: mEvidence['id']): mEvidence|undefined;
  (id: PointParent['id']): PointParent|undefined;
  (id: PointChild['id']): PointChild|undefined;
  (id: ID_TYPE): MODEL_TYPE|undefined;
} = (id:ID_TYPE): any=>{
  const type_store=id_to_store(id);
  if(type_store===undefined) return;
  return type_store().entities[id];
};

// 引数idに対応する要素がなければundefined、idの要素に親がなければnull
export const get_parent_id: {
  (id: mMatch['id']): null|undefined;
  (id: mSide['id']): mSide['parent']|undefined;
  (id: mPart['id']): mPart['parent']|undefined;
  (id: mPoint['id']): mPoint['parent']|undefined;
  (id: mClaim['id']): mClaim['parent']|undefined;
  (id: mEvidence['id']): mEvidence['parent']|undefined;
  (id: mClaim['id'] | mEvidence['id']): mPoint['id']|undefined;
  (id: PointParent['id']): PointParent['parent']|undefined;
  (id: PointChild['id']): PointChild['parent']|undefined;
  (id: ID_TYPE): ID_TYPE|undefined;
} = (id:ID_TYPE): any=>{
  const type_signature = id_to_type(id);
  if(type_signature===undefined||type_signature===mMatchSignature) return null;
  return type_to_store[type_signature]().entities[id]?.parent;
};
export const next_content_id: {
  (id: mMatch['id']): mMatch['id']|undefined;
  (id: mSide['id']): mSide['id']|undefined;
  (id: mPart['id']): mPart['id']|undefined;
  (id: PointChild['id']): PointChild['id']|undefined;
  (id: ID_TYPE): ID_TYPE|undefined;
} = (id:ID_TYPE): any=>{
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

const id_to_prefix: {
  (id: mMatch['id']): typeof match_id_prefix;
  (id: mSide['id']): typeof side_id_prefix;
  (id: mPart['id']): typeof part_id_prefix;
  (id: mPoint['id']): typeof point_id_prefix;
  (id: mClaim['id']): typeof claim_id_prefix;
  (id: mEvidence['id']): typeof evidence_id_prefix;
  (id: PointParent['id']): typeof part_id_prefix | typeof point_id_prefix;
  (id: PointChild['id']): typeof point_id_prefix | typeof claim_id_prefix | typeof evidence_id_prefix;
  (id: ID_TYPE): PREFIX_TYPE;
} = (id:ID_TYPE): any=>{
  if(id_is_mMatch(id)) return match_id_prefix;
  if(id_is_mSide(id)) return side_id_prefix;
  if(id_is_mPart(id)) return part_id_prefix;
  if(id_is_mPoint(id)) return point_id_prefix;
  if(id_is_mClaim(id)) return claim_id_prefix;
  if(id_is_mEvidence(id)) return evidence_id_prefix;
};
// return: a<=>b
export const compare_id = (a:ID_TYPE, b:ID_TYPE): number => {
  const a_prefix = id_to_prefix(a);
  if(a_prefix===undefined) throw TypeError('argument `a` is invalid ID');
  const b_prefix = id_to_prefix(b);
  if(b_prefix===undefined) throw TypeError('argument `b` is invalid ID');
  if(a_prefix!==b_prefix) throw TypeError(`argument \`a\` and \`b\` are of different type: a: ${id_to_type(a)}, b: a: ${id_to_type(b)}`);
  const a_number = parseInt(a.replace(a_prefix,''));
  const b_number = parseInt(b.replace(a_prefix,''));
  if(Number.isNaN(a_number)||Number.isNaN(b_number)) throw TypeError('arguments could not parsed into number');
  return a_number - b_number;
}