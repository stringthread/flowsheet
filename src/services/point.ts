import {baseModel} from 'models/baseModel';
import {mEvidence} from 'models/mEvidence';
import {mPoint,mPointSignature} from 'models/mPoint';
import {generate_evidence} from './evidence'
import { part_add_child } from './part';
import {store} from 'stores';
import {id_is_mPart,id_is_mPoint} from 'stores/ids';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_point_id} from 'stores/ids/id_generators';

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

export function point_add_child(parent_id:mPoint['id'], is_point: true): mPoint;
export function point_add_child(parent_id:mPoint['id'], is_point: false): mEvidence;
export function point_add_child(parent_id:mPoint['id'], is_point: boolean): mPoint|mEvidence{
  let child: mPoint|mEvidence;
  if(is_point) {
    child=generate_point(parent_id);
    store.dispatch(point_slice.actions.add(child));
  } else {
    child=generate_evidence(parent_id);
    store.dispatch(evidence_slice.actions.add(child));
  }
  store.dispatch(point_slice.actions.addChild([parent_id,child.id,is_point]));
  return child;
}

export const append_claim=(parent_id: baseModel['id']): mPoint|undefined=>{
  let child:mPoint|undefined=undefined;
  if(id_is_mPart(parent_id)) child=part_add_child(parent_id);
  else if(id_is_mPoint(parent_id)) child=point_add_child(parent_id,true);
  if(child===undefined) return undefined;
  child={
    ...child,
    contents: '', // string型にすればClaimとして認識される
  };
  store.dispatch(point_slice.actions.upsertOne(child));
  return child;
};
export const append_point=(parent_id: baseModel['id']): mPoint|undefined=>{
  let child:mPoint|undefined=undefined;
  if(id_is_mPart(parent_id)) child=part_add_child(parent_id);
  else if(id_is_mPoint(parent_id)) child=point_add_child(parent_id,true);
  return child;
};
export const append_point_to_part=(parent_id: baseModel['id']): mPoint|undefined=>{
  const point_store=store.getState().point
  let _parent_id: baseModel['id']|undefined=parent_id;
  while(_parent_id!==undefined && id_is_mPoint(_parent_id)){
    console.log(_parent_id);
    _parent_id=point_store.entities[_parent_id]?.parent;
  }
  let child:mPoint|undefined=undefined;
  if(_parent_id!==undefined && id_is_mPart(_parent_id)) child=part_add_child(_parent_id);
  return child;
};
