import {baseModel} from 'models/baseModel';
import {mEvidence, mEvidenceSignature} from 'models/mEvidence';
import { mClaim, mClaimSignature } from 'models/mClaim';
import {is_mPoint, mPoint,mPointSignature, PointChild} from 'models/mPoint';
import {generate_evidence} from './evidence'
import { generate_claim } from './claim';
import { part_add_child } from './part';
import {store} from 'stores';
import {id_is_mEvidence, id_is_mPart,id_is_mPoint, id_is_mClaim, get_parent_id, next_content_id, id_to_store, id_to_type, type_to_store, get_from_id, id_to_slice, compare_id} from './id';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import { claim_slice } from 'stores/slices/claim';
import {generate_point_id, part_id_prefix} from 'stores/ids/id_generators';
import { mMatchSignature } from 'models/mMatch';
import { is_mPart, mPart } from 'models/mPart';
import { part_slice } from 'stores/slices/part';
import { ValidationError } from 'errors';

export const generate_point=(
  parent: baseModel['id'],
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
  store.dispatch((id_to_slice(parent) as typeof part_slice|typeof point_slice)?.actions.addChild([parent, generated.id])); // TODO: asで誤魔化している。#31で早急に修正
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

export const reorder_child = (parent: baseModel['id'], target: baseModel['id'], before: baseModel['id']|null): void =>{
  store.dispatch(point_slice.actions.reorderChild([parent,target,before]));
};

export const get_ancestor_part=(point_id: baseModel['id']): mPart['id']|undefined=>{
  let _parent_id: baseModel['id']|null|undefined=point_id;
  while(_parent_id && !id_is_mPart(_parent_id)){
    _parent_id=get_parent_id(_parent_id);
  }
  return _parent_id??undefined;
}
export const switch_for_append=<T>(
  id: baseModel['id'],
  part: (id:baseModel['id'])=>T,
  claim_evi: (id:baseModel['id'])=>T,
  point: (id:baseModel['id'])=>T
): T|undefined =>{
  if(id_is_mPart(id)) return part(id);
  if(id_is_mEvidence(id) || id_is_mClaim(id)) return claim_evi(id);
  if(id_is_mPoint(id)) return point(id);
};
export const append_sibling_point=(parent_id: baseModel['id']): mPoint|undefined=>{
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
export const append_point_to_part=(parent_id: baseModel['id']): mPoint|undefined=>{
  const _parent_id = get_ancestor_part(parent_id);
  let child:mPoint|undefined=undefined;
  if(_parent_id && id_is_mPart(_parent_id)) child=part_add_child(_parent_id);
  return child;
};
export const append_point_child=(parent_id: baseModel['id']): mPoint|undefined=>{
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

export const set_rebut=(end1:mPoint['id'], end2:mPoint['id'])=>{
  const [to,from] = [end1, end2].sort((end1, end2)=>{
    const part1 = get_ancestor_part(end1);
    if(part1===undefined) throw TypeError('argument `end1` is not descendent of mPart');
    const part2 = get_ancestor_part(end2);
    if(part2===undefined) throw TypeError('argument `end2` is not descendent of mPart');
    return compare_id(part1, part2);
  })
  const obj=get_from_id(from);
  if(!is_mPoint(obj)) throw TypeError('param `from` does not match mPoint');
  store.dispatch(point_slice.actions.upsertOne(
    {
      ...obj,
      rebut_to: to,
    }
  ));
};
export const set_rebut_to=(from: mPoint['id'])=>(
  (rebut_to: mPoint['id'])=>set_rebut(rebut_to, from)
);

export const add_rebut=(rebut_to: mPoint['id'], part: mPart['id'])=>{
  const part_rebut_to = get_ancestor_part(rebut_to);
  if(part_rebut_to===undefined) throw TypeError('argument `rebut_to` is not descendent of mPart');
  if(compare_id(part_rebut_to, part)>=0) throw new ValidationError('cannot rebut to point in later parts');
  const rebut_obj = part_add_child(part);
  set_rebut(rebut_to, rebut_obj.id);
  return rebut_obj;
}
export const add_rebut_to=(part: mPart['id'])=>(
  (rebut_to: mPoint['id'])=>add_rebut(rebut_to, part)
);
