import {store} from 'stores/index';

test('Redux storeの初期状態確認',()=>{
  const expected_initial_state={
    evidence: {
      ids: [],
      entities: {},
      last_id_number: 0
    },
    point: {
      ids: [],
      entities: {},
      last_id_number: 0
    },
    part: {
      ids: [],
      entities: {},
      last_id_number: 0
    },
    side: {
      ids: [],
      entities: {},
      last_id_number: 0
    },
    match: {
      ids: [],
      entities: {},
      last_id_number: 0
    }
  };
  expect(store.getState()).toEqual(expected_initial_state);
});
