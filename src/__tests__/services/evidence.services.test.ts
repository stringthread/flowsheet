import {store} from 'stores';
import {evidence_slice} from 'stores/slices/evidence';
import {mEvidence, mEvidenceSymbol} from 'models/mEvidence';
import {generate_evidence} from 'services/evidence';

beforeEach(()=>{
  store.dispatch(evidence_slice.actions.reset());
});

test('generate_evidence: 引数あり',()=>{
  const expected_result:mEvidence = {
    typesigniture: mEvidenceSymbol,
    id: 'evi_0',
    parent: 'point_0',
    author: 'test_author'
  };
  expect(generate_evidence('point_0',expected_result)).toEqual(expected_result);
  expect(store.getState().evidence.entities[expected_result.id]).toEqual(expected_result);
});

test('generate_evidence: 引数なし',()=>{
  const expected_result:mEvidence = {
    typesigniture: mEvidenceSymbol,
    id: 'evi_0',
    parent: 'point_0'
  };
  expect(generate_evidence('point_0')).toEqual(expected_result);
  expect(store.getState().evidence.entities[expected_result.id]).toEqual(expected_result);
});
