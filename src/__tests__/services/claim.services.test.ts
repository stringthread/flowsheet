import {store} from 'stores';
import {claim_slice} from 'stores/slices/claim';
import {mClaim, mClaimSignature} from 'models/mClaim';
import {generate_claim} from 'services/claim';

beforeEach(()=>{
  store.dispatch(claim_slice.actions.reset());
});

test('generate_claim: 引数あり',()=>{
  const expected_result:mClaim = {
    type_signature: mClaimSignature,
    id: 'claim_0',
    parent: 'point_0',
  };
  expect(generate_claim('point_0',expected_result)).toEqual(expected_result);
  expect(store.getState().claim.entities[expected_result.id]).toEqual(expected_result);
});

test('generate_claim: 引数なし',()=>{
  const expected_result:mClaim = {
    type_signature: mClaimSignature,
    id: 'claim_0',
    parent: 'point_0'
  };
  expect(generate_claim('point_0')).toEqual(expected_result);
  expect(store.getState().claim.entities[expected_result.id]).toEqual(expected_result);
});
