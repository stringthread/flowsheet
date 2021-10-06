import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {mPart,generate_part} from 'models/mPart';

beforeEach(()=>{
  store.dispatch(part_slice.actions.reset());
});

test('generate_part: 引数あり',()=>{
  const expected_result:mPart = {
    id: 'part_0',
    name: 'test_name',
  };
  expect(generate_part(expected_result)).toEqual(expected_result);
  expect(store.getState().part.entities[expected_result.id]).toEqual(expected_result);
});

test('generate_part: 引数なし',()=>{
  const expected_result:mPart = {
    id: 'part_0',
  };
  expect(generate_part()).toEqual(expected_result);
  expect(store.getState().part.entities[expected_result.id]).toEqual(expected_result);
});
