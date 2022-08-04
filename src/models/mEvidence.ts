import {isObject, multipleTypeof} from 'util/typeGuardUtils'
import {store} from 'stores';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_evidence_id} from 'stores/slices/id_generators';
import {baseModel} from './baseModel';
import {mPoint} from './mPoint'

const mEvidenceSymbol=Symbol('mEvidence');

export interface mEvidence extends baseModel {
  parent: baseModel['id'];
  about_author?: string;
  author?: string;
  year?: number|string;
  contents?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) &&
    multipleTypeof(value.id, ['string']) &&
    multipleTypeof(value.about_author, ['undefined','string']) &&
    multipleTypeof(value.author, ['undefined','string']) &&
    multipleTypeof(value.year, ['undefined','number','string']) &&
    multipleTypeof(value.contents, ['undefined','string']);
}

export const generate_evidence=(
  parent: mPoint['id'],
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
