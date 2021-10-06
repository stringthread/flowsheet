import {store} from 'stores';
import {point_slice} from 'stores/slices/point';
import {mPoint,generate_point} from 'models/mPoint';

beforeEach(()=>{
  store.dispatch(point_slice.actions.reset());
});

test('generate_point: 引数あり',()=>{
  const expected_result:mPoint = {
    id: 'point_0',
    numbering: 1,
    _shorthands: new Map<string,number>(),
  };
  expect(generate_point(expected_result)).toEqual(expected_result);
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
});

test('generate_point: 引数なし',()=>{
  const expected_result:mPoint = {
    id: 'point_0',
    _shorthands: new Map<string,number>(),
  };
  expect(generate_point()).toEqual(expected_result);
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
});
