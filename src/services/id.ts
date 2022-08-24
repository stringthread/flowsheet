import {ID_TYPE, evidence_id_prefix, claim_id_prefix, point_id_prefix, part_id_prefix, side_id_prefix, match_id_prefix} from '../stores/ids/id_generators'
import { baseModel } from 'models/baseModel';
import { mMatchSignature } from 'models/mMatch';
import { mSideSignature } from 'models/mSide';
import { mPartSignature } from 'models/mPart';
import { mPointSignature } from 'models/mPoint';
import { mEvidenceSignature } from 'models/mEvidence';
import { store } from 'stores';
import { mClaimSignature } from 'models/mClaim';
import { match_slice } from 'stores/slices/match';
import { side_slice } from 'stores/slices/side';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { claim_slice } from 'stores/slices/claim';
import { evidence_slice } from 'stores/slices/evidence';

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

const id_to_prefix=(id:ID_TYPE)=>{
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