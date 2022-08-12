import {store} from 'stores';
import {match_slice} from 'stores/slices/match';
import {side_slice} from 'stores/slices/side';
import {part_slice} from 'stores/slices/part';
import {mMatch,mMatchSignature} from 'models/mMatch';
import {mPart} from 'models/mPart';
import {generate_match} from 'services/match';

beforeEach(()=>{
  store.dispatch(match_slice.actions.reset());
  store.dispatch(side_slice.actions.reset());
  store.dispatch(part_slice.actions.reset());
});

test('generate_match: 引数sides',()=>{
  const input_sides={
    'aff':['1AC'],
  };
  const expected_result:mMatch = {
    type_signature: mMatchSignature,
    id: 'match_0',
    contents: ['side_0'],
  };
  expect(generate_match(input_sides)).toEqual(expected_result);
  expect(store.getState().match.entities[expected_result.id]).toEqual(expected_result);
  expect(store.getState().side.entities['side_0']?.side).toBe('aff');
  expect(store.getState().part.entities['part_0']?.name).toBe('1AC');
});

test('generate_match: 2引数',()=>{
  const input_sides={
    'aff': ['1AC'],
  };
  const input_match:Omit<mMatch,'id'> = {
    type_signature: mMatchSignature,
    topic: 'test_topic',
  };
  const expected_result:mMatch = {
    type_signature: mMatchSignature,
    id: 'match_0',
    topic: input_match.topic,
    contents: ['side_0'],
  };
  expect(generate_match(input_sides,input_match)).toEqual(expected_result);
  expect(store.getState().match.entities[expected_result.id]).toEqual(expected_result);
  expect(store.getState().side.entities['side_0']?.side).toBe('aff');
  expect(store.getState().part.entities['part_0']?.name).toBe('1AC');
});

test('generate_match: 引数なし',()=>{
  const expected_result:mMatch = {
    type_signature: mMatchSignature,
    id: 'match_0',
    contents: [],
  };
  expect(generate_match()).toEqual(expected_result);
  expect(store.getState().match.entities[expected_result.id]).toEqual(expected_result);
});
