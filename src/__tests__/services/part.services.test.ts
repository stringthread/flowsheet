import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {mPart,mPartSignature} from 'models/mPart';
import {generate_part,part_add_child} from 'services/part';
import { match_slice } from 'stores/slices/match';
import { side_slice } from 'stores/slices/side';
import { mMatch } from 'models/mMatch';
import { is_mSide, mSide } from 'models/mSide';
import { generate_match } from 'services/match';
import { generate_side } from 'services/side';
import { get_from_id } from 'services/id';

beforeEach(()=>{
  store.dispatch(match_slice.actions.reset());
  store.dispatch(side_slice.actions.reset());
  store.dispatch(part_slice.actions.reset());
  store.dispatch(point_slice.actions.reset());
});

const generate_parents=():[mMatch['id'], mSide['id']]=>{
  const match=generate_match();
  const side=generate_side(match.id);
  return [match.id, side.id];
};

test('generate_part: 引数あり',()=>{
  const [_, parent_id]=generate_parents()
  const expected_result:mPart = {
    type_signature: mPartSignature,
    id: 'part_0',
    parent: parent_id,
    name: 'test_name',
    contents: ['point_0'], // 後々仕様変更変更する可能性あり
  };
  const result=generate_part('side_0',expected_result);
  expect(result).toEqual(expected_result);
  expect(store.getState().part.entities[expected_result.id]).toEqual(expected_result);
  const parent_in_redux=get_from_id(parent_id);
  expect(is_mSide(parent_in_redux)).toBeTruthy();
  if(!is_mSide(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('generate_part: 引数なし',()=>{
  const [_, parent_id]=generate_parents()
  const expected_result:mPart = {
    type_signature: mPartSignature,
    id: 'part_0',
    parent: parent_id,
    contents: ['point_0'], // 後々仕様変更変更する可能性あり
  };
  const result=generate_part('side_0');
  expect(result).toEqual(expected_result);
  expect(store.getState().part.entities[expected_result.id]).toEqual(expected_result);
  const parent_in_redux=get_from_id(parent_id);
  expect(is_mSide(parent_in_redux)).toBeTruthy();
  if(!is_mSide(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('part_add_child',()=>{
  const [_, parent_id]=generate_parents()
  const expected_result:mPart = {
    type_signature: mPartSignature,
    id: 'part_0',
    parent: parent_id,
    contents: ['point_0','point_1'],
  };
  const generated=generate_part('side_0');
  const modified=part_add_child(generated.id);
  expect(modified.id).toBe('point_1');
  expect(store.getState().part.entities[expected_result.id]).toEqual(expected_result);
  expect(store.getState().point.entities['point_1']).toBeTruthy();
});
