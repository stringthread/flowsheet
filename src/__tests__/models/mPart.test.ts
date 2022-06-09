import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {mPart,generate_part,part_add_child} from 'models/mPart';

beforeEach(()=>{
  store.dispatch(part_slice.actions.reset());
  store.dispatch(point_slice.actions.reset());
});

test('generate_part: 引数あり',()=>{
  const expected_result:mPart = {
    id: 'part_0',
    parent: 'side_0',
    name: 'test_name',
    contents: ['point_0'], // 後々仕様変更変更する可能性あり
  };
  expect(generate_part('side_0',expected_result)).toEqual(expected_result);
  expect(store.getState().part.entities[expected_result.id]).toEqual(expected_result);
});

test('generate_part: 引数なし',()=>{
  const expected_result:mPart = {
    id: 'part_0',
    parent: 'side_0',
    contents: ['point_0'], // 後々仕様変更変更する可能性あり
  };
  expect(generate_part('side_0')).toEqual(expected_result);
  expect(store.getState().part.entities[expected_result.id]).toEqual(expected_result);
});

test('part_add_child',()=>{
  const expected_result:mPart = {
    id: 'part_0',
    parent: 'side_0',
    contents: ['point_0','point_1'],
  };
  const generated=generate_part('side_0');
  const modified=part_add_child(generated.id);
  expect(modified.id).toBe('point_1');
  expect(store.getState().part.entities[expected_result.id]).toEqual(expected_result);
  expect(store.getState().point.entities['point_1']).toBeTruthy();
});
