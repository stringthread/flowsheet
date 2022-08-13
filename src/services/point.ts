import {baseModel} from 'models/baseModel';
import {mEvidence, mEvidenceSignature} from 'models/mEvidence';
import { mClaim, mClaimSignature } from 'models/mClaim';
import {mPoint,mPointSignature} from 'models/mPoint';
import {generate_evidence} from './evidence'
import { generate_claim } from './claim';
import { part_add_child } from './part';
import {store} from 'stores';
import {id_is_mEvidence, id_is_mPart,id_is_mPoint, id_is_mClaim} from './id';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import { claim_slice } from 'stores/slices/claim';
import {generate_point_id} from 'stores/ids/id_generators';
declare function get_parent_id (id: baseModel['id']): baseModel['id']; // TODO: 別の部分で実装したら削除
declare function next_content_id (id: baseModel['id']): baseModel['id']|null; // TODO: 別の部分で実装したら削除
declare function reorder_child (parent: baseModel['id'], target: baseModel['id'], before: baseModel['id']|null): void; // TODO: 別の部分で実装したら削除

export const generate_point=(
  parent: baseModel['id'],
  from?:Omit<mPoint,'type_signature'|'id'|'parent'|'contents'|'_shorthands'>
):mPoint=>{
  const generated: mPoint= {
    ...from,
    type_signature: mPointSignature,
    id: generate_point_id(),
    parent
  };
  store.dispatch(point_slice.actions.add(generated));
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
  store.dispatch(point_slice.actions.addChild([parent_id,child.id]));
  return child;
}

const switch_for_append=<T>(
  id: baseModel['id'],
  part: (id:baseModel['id'])=>T,
  claim_evi: (id:baseModel['id'])=>T,
  point: (id:baseModel['id'])=>T
): T|undefined =>{
  if(id_is_mPart(id)) return part(id);
  if(id_is_mEvidence(id) || id_is_mClaim(id)) return claim_evi(id);
  if(id_is_mPoint(id)) return point(id);
};
export const append_claim=(parent_id: baseModel['id']): mClaim|undefined=>{
  return switch_for_append(
    parent_id,
    (id)=>append_claim(part_add_child(id).id),
    (id)=>append_claim(get_parent_id(id)),
    (id)=>point_add_child(id,mClaimSignature)
  );
};
export const append_sibling_point=(parent_id: baseModel['id']): mPoint|undefined=>{
  return switch_for_append(
    parent_id,
    (id)=>part_add_child(id),
    (id)=>append_sibling_point(get_parent_id(id)),
    (id)=>point_add_child(get_parent_id(id),mPointSignature)
  );
};
export const append_point_to_part=(parent_id: baseModel['id']): mPoint|undefined=>{
  const point_store=store.getState().point
  let _parent_id: baseModel['id']|undefined=parent_id;
  while(_parent_id!==undefined && !id_is_mPart(_parent_id)){
    _parent_id=point_store.entities[_parent_id]?.parent;
  }
  let child:mPoint|undefined=undefined;
  if(_parent_id!==undefined && id_is_mPart(_parent_id)) child=part_add_child(_parent_id);
  return child;
};
export const append_point_child=(parent_id: baseModel['id']): mPoint|undefined=>{
  return switch_for_append(
    parent_id,
    (id)=>part_add_child(id),
    (id)=>{
      const parent_id=get_parent_id(id);
      const child=append_point_child(parent_id);
      if(child===undefined) return;
      reorder_child(parent_id, child.id, next_content_id(id));
      return child;
    },
    (id)=>point_add_child(id,mPointSignature)
  )
}
