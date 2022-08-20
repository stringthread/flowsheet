import {store} from 'stores/index';
import {EntityStateWithLastID} from 'stores/slices/EntityStateWithLastID';
import {claim_slice} from 'stores/slices/claim';
import {generate_claim_id} from 'stores/ids/id_generators';
import {mClaim,mClaimSignature} from 'models/mClaim';

const initial_claim_state: EntityStateWithLastID<mClaim>={
  ids: [],
  entities: {},
  last_id_number: 0
};

test('claim/add reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(claim_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_claim_state);
  const test_claim: mClaim={
    type_signature: mClaimSignature,
    id_obj: 'claim_0',
    parent: 'point_0',
    contents: 'test_contents'
  };
  const expected_claim_state: EntityStateWithLastID<mClaim>={
    ids: ['claim_0'],
    entities: {
      claim_0:test_claim
    },
    last_id_number: 0
  }
  store.dispatch(claim_slice.actions.add(test_claim));
  expect(store.getState().claim).toMatchObject(expected_claim_state);
});

test('claim/upsertOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(claim_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_claim_state);
  const test_claim_before: mClaim={
    type_signature: mClaimSignature,
    id_obj: 'claim_0',
    parent: 'point_0',
    contents: 'before'
  };
  const test_claim_after: mClaim={
    type_signature: mClaimSignature,
    id_obj: 'claim_0',
    parent: 'point_0',
    contents: 'before'
  };
  store.dispatch(claim_slice.actions.add(test_claim_before));
  store.dispatch(claim_slice.actions.upsertOne(test_claim_after));
  expect(store.getState().claim.entities.claim_0).toMatchObject(test_claim_after);
});

test('claim/removeOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(claim_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_claim_state);
  const test_claim: mClaim={
    type_signature: mClaimSignature,
    id_obj: 'claim_0',
    parent: 'point_0',
    contents: 'test_contents'
  };
  const expected_claim_state: EntityStateWithLastID<mClaim>={
    ids: [],
    entities: {},
    last_id_number: 0
  }
  store.dispatch(claim_slice.actions.add(test_claim));
  store.dispatch(claim_slice.actions.removeOne('claim_0'));
  expect(store.getState().claim).toMatchObject(expected_claim_state);
});

test('claim/removeAll reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(claim_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_claim_state);
  const test_claim: mClaim={
    type_signature: mClaimSignature,
    id_obj: 'claim_0',
    parent: 'point_0',
    contents: 'test_contents'
  };
  const expected_claim_state: EntityStateWithLastID<mClaim>={
    ids: [],
    entities: {},
    last_id_number: 0
  }
  store.dispatch(claim_slice.actions.add(test_claim));
  store.dispatch(claim_slice.actions.removeAll());
  expect(store.getState().claim).toMatchObject(expected_claim_state);
});

test('claim/setParent reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(claim_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_claim_state);
  const test_claim: mClaim={
    type_signature: mClaimSignature,
    id_obj: 'claim_0',
    parent: 'point_0',
    contents: 'test_contents'
  };
  const expected_claim: mClaim={
    ...test_claim,
    parent: 'point_new'
  }
  store.dispatch(claim_slice.actions.add(test_claim));
  store.dispatch(claim_slice.actions.setParent(['claim_0','point_new']));
  expect(store.getState().claim.entities.claim_0).toMatchObject(expected_claim);
});

test('claim/incrementID reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(claim_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_claim_state);
  store.dispatch(claim_slice.actions.incrementID());
  expect(store.getState().claim.last_id_number).toBe(1);
});

test('generate_claim_idの確認',()=>{
  // storeの状態をリセット
  store.dispatch(claim_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_claim_state);
  expect(generate_claim_id()).toBe('claim_0');
  expect(generate_claim_id()).toBe('claim_1');
});
