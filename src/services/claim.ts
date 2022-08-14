import {store} from 'stores';
import {claim_slice} from 'stores/slices/claim';
import {generate_claim_id} from 'stores/ids/id_generators';
import {mClaim, mClaimSignature} from 'models/mClaim';
import { get_from_id } from './id';
import { is_mPoint, mPoint } from 'models/mPoint';
import { point_slice } from 'stores/slices/point';

export const generate_claim=(
  parent: mPoint['id'],
  from?: Omit<mClaim,'id'>
):mClaim=>{
  const parent_obj=get_from_id(parent);
  if(!is_mPoint(parent_obj)) throw TypeError('argument `parent` does not match mPoint');
  const generated: mClaim= {
    ...from,
    type_signature: mClaimSignature,
    id: generate_claim_id(),
    parent,
  };
  store.dispatch(claim_slice.actions.add(generated));
  store.dispatch(point_slice.actions.addChild([parent, generated.id]));
  return generated;
}
