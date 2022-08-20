import {store} from 'stores/index';
import {EntityStateWithLastID} from 'stores/slices/EntityStateWithLastID';
import {match_slice} from 'stores/slices/match';
import {generate_match_id} from 'stores/ids/id_generators';
import {mMatch,mMatchSignature} from 'models/mMatch';

const initial_match_state: EntityStateWithLastID<mMatch>={
  ids: [],
  entities: {},
  last_id_number: 0
}

test('match/removeAll reducerの確認',()=>{
  const test_match: mMatch={
    type_signature: mMatchSignature,
    id_obj: 'match_2',
    winner: 'Aff'
  };
  store.dispatch(match_slice.actions.add(test_match));
  store.dispatch(match_slice.actions.removeAll());
  expect(store.getState().match).toEqual(initial_match_state);
});

test('match/add reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(match_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_match_state);
  const test_match: mMatch={
    type_signature: mMatchSignature,
    id_obj: 'match_0',
    winner: 'Aff'
  };
  const expected_match_state: EntityStateWithLastID<mMatch>={
    ids: ['match_0'],
    entities: {
      match_0:test_match
    },
    last_id_number: 0
  }
  store.dispatch(match_slice.actions.add(test_match));
  expect(store.getState().match).toMatchObject(expected_match_state);
});

test('match/upsertOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(match_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_match_state);
  const test_match_before: mMatch={
    type_signature: mMatchSignature,
    id_obj: 'match_0',
    topic: 'before'
  };
  const test_match_after: mMatch={
    type_signature: mMatchSignature,
    id_obj: 'match_0',
    topic: 'after'
  };
  store.dispatch(match_slice.actions.add(test_match_before));
  store.dispatch(match_slice.actions.upsertOne(test_match_after));
  expect(store.getState().match.entities.match_0).toMatchObject(test_match_after);
});

test('match/removeOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(match_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_match_state);
  const test_match: mMatch={
    type_signature: mMatchSignature,
    id_obj: 'match_1',
    winner: 'Aff'
  };
  const test_match_2: mMatch={
    type_signature: mMatchSignature,
    id_obj: 'match_2',
    winner: 'Aff'
  };
  const expected_match_state: EntityStateWithLastID<mMatch>={
    ids: ['match_2'],
    entities: {
      match_2: test_match_2
    },
    last_id_number: 0
  }
  store.dispatch(match_slice.actions.add(test_match));
  store.dispatch(match_slice.actions.add(test_match_2));
  store.dispatch(match_slice.actions.removeOne('match_1'));
  expect(store.getState().match).toMatchObject(expected_match_state);
});

test('match/addChild reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(match_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_match_state);
  const test_match: mMatch={
    type_signature: mMatchSignature,
    id_obj: 'match_3',
    winner: 'Aff',
    contents: ['part_0']
  };
  const expected_match_content: mMatch['contents']=['part_0','part_1']
  store.dispatch(match_slice.actions.add(test_match));
  store.dispatch(match_slice.actions.addChild(['match_3',expected_match_content[1]]));
  expect(store.getState().match.entities.match_3?.contents).toEqual(expected_match_content);
});

test('match/addChild reducer: contentsが空のとき',()=>{
  // storeの状態をリセット
  store.dispatch(match_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_match_state);
  const test_match: mMatch={
    type_signature: mMatchSignature,
    id_obj: 'match_4',
    winner: 'Aff'
  };
  const expected_match_content: mMatch['contents']=['part_0']
  store.dispatch(match_slice.actions.add(test_match));
  store.dispatch(match_slice.actions.addChild(['match_4',expected_match_content[0]]));
  expect(store.getState().match.entities.match_4?.contents).toEqual(expected_match_content);
});

test('match/incrementID reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(match_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_match_state);
  store.dispatch(match_slice.actions.incrementID());
  expect(store.getState().match.last_id_number).toBe(1);
});

test('generate_match_idの確認',()=>{
  // storeの状態をリセット
  store.dispatch(match_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_match_state);
  expect(generate_match_id()).toBe('match_0');
  expect(generate_match_id()).toBe('match_1');
});
