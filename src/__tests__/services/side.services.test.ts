import {store} from 'stores';
import {side_slice} from 'stores/slices/side';
import {part_slice} from 'stores/slices/part';
import {mSide,mSideSignature} from 'models/mSide';
import {generate_side} from 'services/side';
import { generate_match } from 'services/match';
import { match_slice } from 'stores/slices/match';
import { get_from_id } from 'services/id';
import { is_mMatch } from 'models/mMatch';

beforeEach(()=>{
  store.dispatch(match_slice.actions.reset());
  store.dispatch(side_slice.actions.reset());
  store.dispatch(part_slice.actions.reset());
});

test('generate_side: 引数parts',()=>{
  const parent=generate_match();
  const expected_result:mSide = {
    type_signature: mSideSignature,
    id: 'side_0',
    parent: parent.id,
    side: undefined,
    contents: ['part_0'],
  };
  const result=generate_side('match_0',['test_part'])
  expect(result).toEqual(expected_result);
  expect(store.getState().side.entities[expected_result.id]).toEqual(expected_result);
  const parent_in_redux=get_from_id(parent.id);
  expect(is_mMatch(parent_in_redux)).toBeTruthy();
  if(!is_mMatch(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('generate_side: 2引数',()=>{
  const parent=generate_match();
  const expected_result:mSide = {
    type_signature: mSideSignature,
    id: 'side_0',
    parent: parent.id,
    side: 'test_side',
    contents: ['part_0'],
  };
  const result=generate_side('match_0',['test_part'],expected_result);
  expect(result).toEqual(expected_result);
  // expected_result.contentsは明らかに配列要素だがTSは`Array<...>|undefined`と推論してくる
  // @ts-ignore
  expect(store.getState().part.ids).toContain(expected_result.contents[0]);
  expect(store.getState().side.entities[expected_result.id]).toEqual(expected_result);
  const parent_in_redux=get_from_id(parent.id);
  expect(is_mMatch(parent_in_redux)).toBeTruthy();
  if(!is_mMatch(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('generate_side: 引数なし',()=>{
  const parent=generate_match();
  const expected_result:mSide = {
    type_signature: mSideSignature,
    id: 'side_0',
    parent: parent.id,
    side: undefined,
    contents: [],
  };
  const result=generate_side('match_0');
  expect(result).toEqual(expected_result);
  expect(store.getState().side.entities[expected_result.id]).toEqual(expected_result);
  const parent_in_redux=get_from_id(parent.id);
  expect(is_mMatch(parent_in_redux)).toBeTruthy();
  if(!is_mMatch(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});
