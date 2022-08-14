import {store} from 'stores';
import {evidence_slice} from 'stores/slices/evidence';
import {mEvidence, mEvidenceSignature} from 'models/mEvidence';
import {generate_evidence} from 'services/evidence';
import { mMatch } from 'models/mMatch';
import { mPart } from 'models/mPart';
import { is_mPoint, mPoint } from 'models/mPoint';
import { mSide } from 'models/mSide';
import { generate_match } from 'services/match';
import { generate_part } from 'services/part';
import { generate_point } from 'services/point';
import { generate_side } from 'services/side';
import { match_slice } from 'stores/slices/match';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { side_slice } from 'stores/slices/side';
import { get_from_id } from 'services/id';

beforeEach(()=>{
  store.dispatch(match_slice.actions.reset());
  store.dispatch(side_slice.actions.reset());
  store.dispatch(part_slice.actions.reset());
  store.dispatch(point_slice.actions.reset());
  store.dispatch(evidence_slice.actions.reset());
});

const generate_parents=():[mMatch['id'], mSide['id'], mPart['id'], mPoint['id']]=>{
  const match=generate_match();
  const side=generate_side(match.id);
  const part=generate_part(side.id);
  const point=generate_point(part.id);
  return [match.id, side.id, part.id, point.id];
};

test('generate_evidence: 引数あり',()=>{
  const point_id=generate_parents()[3];
  const expected_result:mEvidence = {
    type_signature: mEvidenceSignature,
    id: 'evi_0',
    parent: point_id,
    author: 'test_author'
  };
  const result=generate_evidence(point_id,expected_result);
  expect(result).toEqual(expected_result);
  expect(store.getState().evidence.entities[expected_result.id]).toEqual(expected_result);
  const parent_in_redux=get_from_id(point_id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if(!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('generate_evidence: 引数なし',()=>{
  const point_id=generate_parents()[3];
  const expected_result:mEvidence = {
    type_signature: mEvidenceSignature,
    id: 'evi_0',
    parent: point_id
  };
  const result=generate_evidence(point_id)
  expect(result).toEqual(expected_result);
  expect(store.getState().evidence.entities[expected_result.id]).toEqual(expected_result);
  const parent_in_redux=get_from_id(point_id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if(!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});
