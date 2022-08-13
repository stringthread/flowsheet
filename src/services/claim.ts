import {store} from 'stores';
import {claim_slice} from 'stores/slices/claim';
import {generate_claim_id} from 'stores/ids/id_generators';
import {baseModel} from 'models/baseModel';
import {mClaim, mClaimSignature} from 'models/mClaim';

export const generate_claim=(
  parent: baseModel['id'],
  from?: Omit<mClaim,'id'>
):mClaim=>{
  const generated: mClaim= {
    ...from,
    type_signature: mClaimSignature,
    id: generate_claim_id(),
    parent,
  };
  store.dispatch(claim_slice.actions.add(generated));
  return generated;
}
