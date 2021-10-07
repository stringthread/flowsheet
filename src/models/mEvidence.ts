import {isObject, multipleTypeof} from 'util/typeGuardUtils'
import {store} from 'stores';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_evidence_id} from 'stores/slices/id_generators';

export interface mEvidence {
  id: string;
  about_author?: string;
  author?: string;
  year?: number|string;
  content?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) &&
    multipleTypeof(value.id, ['string']) &&
    multipleTypeof(value.about_author, ['undefined','string']) &&
    multipleTypeof(value.author, ['undefined','string']) &&
    multipleTypeof(value.year, ['undefined','number','string']) &&
    multipleTypeof(value.content, ['undefined','string']);
}

export const generate_evidence=(
  from?: Omit<mEvidence,'id'|'content'>
):mEvidence=>{
  const generated: mEvidence= {
    ...from,
    id: generate_evidence_id(),
  };
  store.dispatch(evidence_slice.actions.add(generated));
  return generated;
}
