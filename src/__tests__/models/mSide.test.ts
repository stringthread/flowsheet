import {store} from 'stores';
import {side_slice} from 'stores/slices/side';
import {part_slice} from 'stores/slices/part';
import {mSide,generate_side} from 'models/mSide';

beforeEach(()=>{
  store.dispatch(side_slice.actions.reset());
  store.dispatch(part_slice.actions.reset());
});

test('generate_side: 引数parts',()=>{
  const expected_result:mSide = {
    id: 'side_0',
    side: undefined,
    contents: ['part_0'],
  };
  expect(generate_side(['test_part'])).toEqual(expected_result);
  expect(store.getState().side.entities[expected_result.id]).toEqual(expected_result);
});

test('generate_side: 2引数',()=>{
  const expected_result:mSide = {
    id: 'side_0',
    side: 'test_side',
    contents: ['part_0'],
  };
  expect(generate_side(['test_part'],expected_result)).toEqual(expected_result);
  // expected_result.contentsは明らかに配列要素だがTSは`Array<...>|undefined`と推論してくる
  // @ts-ignore
  expect(store.getState().part.ids).toContain(expected_result.contents[0]);
  expect(store.getState().side.entities[expected_result.id]).toEqual(expected_result);
});

test('generate_side: 引数なし',()=>{
  const expected_result:mSide = {
    id: 'side_0',
    side: undefined,
    contents: [],
  };
  expect(generate_side()).toEqual(expected_result);
  expect(store.getState().side.entities[expected_result.id]).toEqual(expected_result);
});
