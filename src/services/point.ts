import {baseModel} from 'models/baseModel';
import {mEvidence, mEvidenceSignature, is_mEvidenceId, mEvidenceId} from 'models/mEvidence';
import { mClaim, mClaimSignature, is_mClaimId, mClaimId } from 'models/mClaim';
import {is_mPoint, mPoint, mPointSignature, is_mPointId, mPointId, PointChildId} from 'models/mPoint';
import {generate_evidence} from './evidence'
import { generate_claim } from './claim';
import { part_add_child } from './part';
import {store} from 'stores';
import { get_parent_id, next_content_id, id_to_store, id_to_type, type_to_store, get_from_id, id_to_slice} from './id';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import { claim_slice } from 'stores/slices/claim';
import {generate_point_id} from 'stores/ids/id_generators';
import { mMatchSignature } from 'models/mMatch';
import { is_mPart, is_mPartId, mPartId } from 'models/mPart';
import { part_slice } from 'stores/slices/part';
import { assertNever } from 'util/utilityTypes';

export const generate_point=(
  parent: mPartId|mPointId,
  from?:Omit<mPoint,'type_signature'|'id'|'parent'|'contents'|'_shorthands'>
):mPoint=>{
  const parent_obj=get_from_id(parent);
  if(!is_mPart(parent_obj)&&!is_mPoint(parent_obj)) throw TypeError('argument `parent` does not match mPart|mPoint');
  const generated: mPoint= {
    ...from,
    type_signature: mPointSignature,
    id: generate_point_id(),
    parent
  };
  store.dispatch(point_slice.actions.add(generated));
  if(is_mPartId(parent)) store.dispatch(id_to_slice(parent).actions.addChild([parent, generated.id]));
  else if(is_mPointId(parent)) store.dispatch(id_to_slice(parent).actions.addChild([parent, generated.id]));
  return generated;
}

export function point_add_child(parent_id:mPoint['id'], type: mPoint['type_signature']): mPoint;
export function point_add_child(parent_id:mPoint['id'], type: mClaim['type_signature']): mClaim;
export function point_add_child(parent_id:mPoint['id'], type: mEvidence['type_signature']): mEvidence;
export function point_add_child(parent_id:mPoint['id'], type: baseModel['type_signature']): mPoint|mEvidence|mClaim{
  let child: mPoint|mEvidence|mClaim;
  if(type===mPointSignature) {
    child=generate_point(parent_id);
    store.dispatch(point_slice.actions.add(child));
  } else if(type===mEvidenceSignature) {
    child=generate_evidence(parent_id);
    store.dispatch(evidence_slice.actions.add(child));
  } else {
    child=generate_claim(parent_id);
    store.dispatch(claim_slice.actions.add(child));
  }
  return child;
}

export const reorder_child = (parent: mPointId, target:PointChildId, before:PointChildId|null): void =>{
  store.dispatch(point_slice.actions.reorderChild([parent,target,before]));
};

type accept_switch_for_append=mPartId|mEvidenceId|mClaimId|mPointId;
const switch_for_append=<T>(
  id: accept_switch_for_append,
  part: (id:mPartId)=>T,
  claim_evi: (id:mEvidenceId|mClaimId)=>T,
  point: (id:mPointId)=>T
): T|undefined =>{
  if(is_mPartId(id)) return part(id);
  if(is_mEvidenceId(id) || is_mClaimId(id)) return claim_evi(id);
  if(is_mPointId(id)) return point(id);
  assertNever(id);
};
export const append_claim=(parent_id: accept_switch_for_append): mClaim|undefined=>{
  return switch_for_append(
    parent_id,
    (id)=>append_claim(part_add_child(id).id),
    (id)=>{
      const parent_id=get_parent_id(id);
      if(parent_id!==undefined&&parent_id!==null) return append_claim(parent_id);
    },
    (id)=>point_add_child(id,mClaimSignature)
  );
};
export const append_sibling_point=(parent_id: accept_switch_for_append): mPoint|undefined=>{
  return switch_for_append(
    parent_id,
    (id)=>part_add_child(id),
    (id)=>{
      const parent_id=get_parent_id(id);
      if(parent_id===undefined||parent_id===null) return;
      return append_sibling_point(parent_id);
    },
    (id)=>{
      const parent_id=get_parent_id(id);
      if(parent_id===undefined||parent_id===null) return;
      const child=point_add_child(parent_id, mPointSignature);
      const reorder_before=next_content_id(id);
      if(reorder_before===undefined) return;
      reorder_child(parent_id, child.id, reorder_before);
      return child;
    }
  );
};
export const append_point_to_part=(parent_id: accept_switch_for_append): mPoint|undefined=>{
  let _parent_id: baseModel['id']|null|undefined=parent_id;
  while(_parent_id && !is_mPartId(_parent_id)){
    _parent_id=get_parent_id(_parent_id);
  }
  let child:mPoint|undefined=undefined;
  if(_parent_id && is_mPartId(_parent_id)) child=part_add_child(_parent_id);
  return child;
};
export const append_point_child=(parent_id: accept_switch_for_append): mPoint|undefined=>{
  return switch_for_append(
    parent_id,
    (id)=>part_add_child(id),
    (id)=>{
      const parent_id=get_parent_id(id);
      if(parent_id===undefined||parent_id===null) return;
      const child=append_point_child(parent_id);
      if(child===undefined) return;
      const reorder_before=next_content_id(id);
      if(reorder_before===undefined) return;
      reorder_child(parent_id, child.id, reorder_before);
      return child;
    },
    (id)=>point_add_child(id,mPointSignature)
  )
}
