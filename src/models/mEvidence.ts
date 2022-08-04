import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {store} from 'stores';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_evidence_id} from 'stores/ids/id_generators';
import {baseModel} from './baseModel';

const mEvidenceSymbol=Symbol('mEvidence');

export interface mEvidence extends baseModel {
  typesigniture: typeof mEvidenceSymbol,
  parent: baseModel['id'];
  about_author?: string;
  author?: string;
  year?: number|string;
  contents?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) && value.typesigniture==mEvidenceSymbol;
}

export const generate_evidence=(
  parent: baseModel['id'],
  from?: Omit<mEvidence,'id'|'content'>
):mEvidence=>{
  const generated: mEvidence= {
    ...from,
    typesigniture: mEvidenceSymbol,
    id: generate_evidence_id(),
    parent,
  };
  store.dispatch(evidence_slice.actions.add(generated));
  return generated;
}
