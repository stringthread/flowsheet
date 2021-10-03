import {store} from 'stores/index';
import {EntityStateWithLastID} from 'stores/slices/EntityStateWithLastID';
import {side_slice} from 'stores/slices/side';
import {mSide} from 'models/mSide';

const initial_side_state: EntityStateWithLastID<mSide>={
  ids: [],
  entities: {},
  last_id_number: 0
}

test('side/removeAll reducerの確認',()=>{
  const test_side: mSide={
    id: 'side_2',
    side: 'Aff'
  };
  store.dispatch(side_slice.actions.add(test_side));
  store.dispatch(side_slice.actions.removeAll());
  expect(store.getState().side).toMatchObject(initial_side_state);
});

test('side/add reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(side_slice.actions.removeAll());
  expect(store.getState().side).toMatchObject(initial_side_state);
  const test_side: mSide={
    id: 'side_0',
    side: 'Aff'
  };
  const expected_side_state: EntityStateWithLastID<mSide>={
    ids: ['side_0'],
    entities: {
      side_0:test_side
    },
    last_id_number: 0
  }
  store.dispatch(side_slice.actions.add(test_side));
  expect(store.getState().side).toMatchObject(expected_side_state);
});

test('side/removeOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(side_slice.actions.removeAll());
  expect(store.getState().side).toMatchObject(initial_side_state);
  const test_side: mSide={
    id: 'side_1',
    side: 'Aff'
  };
  const test_side_2: mSide={
    id: 'side_2',
    side: 'Aff'
  };
  const expected_side_state: EntityStateWithLastID<mSide>={
    ids: ['side_2'],
    entities: {
      side_2: test_side_2
    },
    last_id_number: 0
  }
  store.dispatch(side_slice.actions.add(test_side));
  store.dispatch(side_slice.actions.add(test_side_2));
  store.dispatch(side_slice.actions.removeOne('side_1'));
  expect(store.getState().side).toMatchObject(expected_side_state);
});

test('side/addChild reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(side_slice.actions.removeAll());
  expect(store.getState().side).toMatchObject(initial_side_state);
  const test_side: mSide={
    id: 'side_3',
    side: 'Aff',
    contents: ['point_0']
  };
  const expected_side_content: mSide['contents']=['point_0','point_1']
  store.dispatch(side_slice.actions.add(test_side));
  store.dispatch(side_slice.actions.addChild(['side_3',expected_side_content[1]]));
  expect(store.getState().side.entities.side_3?.contents).toEqual(expected_side_content);
});

test('side/addChild reducer: contentsが空のとき',()=>{
  // storeの状態をリセット
  store.dispatch(side_slice.actions.removeAll());
  expect(store.getState().side).toMatchObject(initial_side_state);
  const test_side: mSide={
    id: 'side_4',
    side: 'Aff'
  };
  const expected_side_content: mSide['contents']=['point_0']
  store.dispatch(side_slice.actions.add(test_side));
  store.dispatch(side_slice.actions.addChild(['side_4',expected_side_content[0]]));
  expect(store.getState().side.entities.side_4?.contents).toEqual(expected_side_content);
});

test('side/incrementID reducerの確認',()=>{
  store.dispatch(side_slice.actions.incrementID());
  expect(store.getState().side.last_id_number).toBe(1);
});
