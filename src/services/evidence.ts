import {store} from 'stores';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_evidence_id} from 'stores/ids/id_generators';
import {baseModel} from 'models/baseModel';
import {mEvidence, mEvidenceSignature} from 'models/mEvidence';

export const generate_evidence=(
  parent: baseModel['id'],
  from?: Omit<mEvidence,'id'|'content'>
):mEvidence=>{
  const generated: mEvidence= {
    ...from,
    type_signature: mEvidenceSignature,
    id: generate_evidence_id(),
    parent,
  };
  store.dispatch(evidence_slice.actions.add(generated));
  return generated;
}
