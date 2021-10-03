import {store} from 'stores/index';
import {EntityStateWithLastID} from 'stores/slices/EntityStateWithLastID';
import {evidence_slice} from 'stores/slices/evidence';
import {mEvidence} from 'models/mEvidence';

test('evidence/add reducerの確認',()=>{
  const test_evidence: mEvidence={
    id: 'evi_0',
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

test('evidence/removeOne reducerの確認',()=>{
  const test_evidence: mEvidence={
    id: 'evi_0',
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
  const test_evidence: mEvidence={
    id: 'evi_0',
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

test('evidence/incrementID reducerの確認',()=>{
  store.dispatch(evidence_slice.actions.incrementID());
  expect(store.getState().evidence.last_id_number).toBe(1);
});
