import {store} from 'stores';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_evidence_id} from 'stores/ids/id_generators';
import {mEvidence, mEvidenceSignature} from 'models/mEvidence';
import { get_from_id } from './id';
import { is_mPoint, mPointId } from 'models/mPoint';
import { point_slice } from 'stores/slices/point';

export const generate_evidence=(
  parent: mPointId,
  from?: Omit<mEvidence,'id'|'content'>
):mEvidence=>{
  const parent_obj=get_from_id(parent);
  if(!is_mPoint(parent_obj)) throw TypeError('argument `parent` does not match mPoint');
  const generated: mEvidence= {
    ...from,
    type_signature: mEvidenceSignature,
    id: generate_evidence_id(),
    parent,
  };
  store.dispatch(evidence_slice.actions.add(generated));
  store.dispatch(point_slice.actions.addChild([parent, generated.id]));
  return generated;
}
