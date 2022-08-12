import {baseModel} from 'models/baseModel';
import {mEvidence} from 'models/mEvidence';
import {mPoint,mPointSignature} from 'models/mPoint';
import {generate_evidence} from './evidence'
import {store} from 'stores';
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
