import {store} from 'stores/index';
import {EntityStateWithLastID} from 'stores/slices/EntityStateWithLastID';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_evidence_id} from 'stores/slices/id_generators';
import {mEvidence} from 'models/mEvidence';

const initial_evidence_state: EntityStateWithLastID<mEvidence>={
  ids: [],
  entities: {},
  last_id_number: 0
};

test('evidence/add reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(evidence_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_evidence_state);
  const test_evidence: mEvidence={
    id: 'evi_0',
    parent: 'point_0',
    author: 'test author',
    content: 'test_content'
  };
  const expected_evidence_state: EntityStateWithLastID<mEvidence>={
    ids: ['evi_0'],
    entities: {
      evi_0:test_evidence
    },
    last_id_number: 0
  }
  store.dispatch(evidence_slice.actions.add(test_evidence));
  expect(store.getState().evidence).toMatchObject(expected_evidence_state);
});

test('evidence/upsertOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(evidence_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_evidence_state);
  const test_evidence_before: mEvidence={
    id: 'evi_0',
    parent: 'point_0',
    content: 'before'
  };
  const test_evidence_after: mEvidence={
    id: 'evi_0',
    parent: 'point_0',
    content: 'before'
  };
  store.dispatch(evidence_slice.actions.add(test_evidence_before));
  store.dispatch(evidence_slice.actions.upsertOne(test_evidence_after));
  expect(store.getState().evidence.entities.evi_0).toMatchObject(test_evidence_after);
});

test('evidence/removeOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(evidence_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_evidence_state);
  const test_evidence: mEvidence={
    id: 'evi_0',
    parent: 'point_0',
    author: 'test author',
    content: 'test_content'
  };
  const expected_evidence_state: EntityStateWithLastID<mEvidence>={
    ids: [],
    entities: {},
    last_id_number: 0
  }
  store.dispatch(evidence_slice.actions.add(test_evidence));
  store.dispatch(evidence_slice.actions.removeOne('evi_0'));
  expect(store.getState().evidence).toMatchObject(expected_evidence_state);
});

test('evidence/removeAll reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(evidence_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_evidence_state);
  const test_evidence: mEvidence={
    id: 'evi_0',
    parent: 'point_0',
    author: 'test author',
    content: 'test_content'
  };
  const expected_evidence_state: EntityStateWithLastID<mEvidence>={
    ids: [],
    entities: {},
    last_id_number: 0
  }
  store.dispatch(evidence_slice.actions.add(test_evidence));
  store.dispatch(evidence_slice.actions.removeAll());
  expect(store.getState().evidence).toMatchObject(expected_evidence_state);
});

test('evidence/setParent reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(evidence_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_evidence_state);
  const test_evidence: mEvidence={
    id: 'evi_0',
    parent: 'point_0',
    author: 'test author',
    content: 'test_content'
  };
  const expected_evidence: mEvidence={
    ...test_evidence,
    parent: 'point_new'
  }
  store.dispatch(evidence_slice.actions.add(test_evidence));
  store.dispatch(evidence_slice.actions.setParent(['evi_0','point_new']));
  expect(store.getState().evidence.entities.evi_0).toMatchObject(expected_evidence);
});

test('evidence/incrementID reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(evidence_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_evidence_state);
  store.dispatch(evidence_slice.actions.incrementID());
  expect(store.getState().evidence.last_id_number).toBe(1);
});

test('generate_evidence_idの確認',()=>{
  // storeの状態をリセット
  store.dispatch(evidence_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_evidence_state);
  expect(generate_evidence_id()).toBe('evi_0');
  expect(generate_evidence_id()).toBe('evi_1');
});
