import { mPart, mPartSignature } from 'models/mPart';
import { generate_part_id } from 'stores/ids/id_generators';
import { store } from 'stores/index';
import { EntityStateWithLastID } from 'stores/slices/EntityStateWithLastID';
import { part_slice } from 'stores/slices/part';

const initial_part_state: EntityStateWithLastID<mPart> = {
  ids: [],
  entities: {},
  last_id_number: 0,
};

test('part/removeAll reducerの確認', () => {
  const test_part: mPart = {
    type_signature: mPartSignature,
    id: 'part_2',
    parent: 'side_0',
    name: '1AC',
  };
  store.dispatch(part_slice.actions.add(test_part));
  store.dispatch(part_slice.actions.removeAll());
  expect(store.getState().part).toEqual(initial_part_state);
});

test('part/add reducerの確認', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().part).toEqual(initial_part_state);
  const test_part: mPart = {
    type_signature: mPartSignature,
    id: 'part_0',
    parent: 'side_0',
    name: '1AC',
  };
  const expected_part_state: EntityStateWithLastID<mPart> = {
    ids: ['part_0'],
    entities: {
      part_0: test_part,
    },
    last_id_number: 0,
  };
  store.dispatch(part_slice.actions.add(test_part));
  expect(store.getState().part).toMatchObject(expected_part_state);
});

test('part/upsertOne reducerの確認', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_part_state);
  const test_part_before: mPart = {
    type_signature: mPartSignature,
    id: 'part_0',
    parent: 'side_0',
    name: '1AC',
  };
  const test_part_after: mPart = {
    type_signature: mPartSignature,
    id: 'part_0',
    parent: 'side_0',
    name: '1NC',
  };
  store.dispatch(part_slice.actions.add(test_part_before));
  store.dispatch(part_slice.actions.upsertOne(test_part_after));
  expect(store.getState().part.entities.part_0).toMatchObject(test_part_after);
});

test('part/removeOne reducerの確認', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().part).toEqual(initial_part_state);
  const test_part: mPart = {
    type_signature: mPartSignature,
    id: 'part_1',
    parent: 'side_0',
    name: '1AC',
  };
  const test_part_2: mPart = {
    type_signature: mPartSignature,
    id: 'part_2',
    parent: 'side_0',
    name: '1AC',
  };
  const expected_part_state: EntityStateWithLastID<mPart> = {
    ids: ['part_2'],
    entities: {
      part_2: test_part_2,
    },
    last_id_number: 0,
  };
  store.dispatch(part_slice.actions.add(test_part));
  store.dispatch(part_slice.actions.add(test_part_2));
  store.dispatch(part_slice.actions.removeOne('part_1'));
  expect(store.getState().part).toMatchObject(expected_part_state);
});

test('part/addChild reducerの確認', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().part).toEqual(initial_part_state);
  const test_part: mPart = {
    type_signature: mPartSignature,
    id: 'part_3',
    parent: 'side_0',
    name: '1AC',
    contents: ['point_0'],
  };
  const expected_part_content: mPart['contents'] = ['point_0', 'point_1'];
  store.dispatch(part_slice.actions.add(test_part));
  store.dispatch(part_slice.actions.addChild(['part_3', expected_part_content[1]]));
  expect(store.getState().part.entities.part_3?.contents).toEqual(expected_part_content);
});

test('part/addChild reducer: contentsが空のとき', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().part).toEqual(initial_part_state);
  const test_part: mPart = {
    type_signature: mPartSignature,
    id: 'part_4',
    parent: 'side_0',
    name: '1AC',
  };
  const expected_part_content: mPart['contents'] = ['point_0'];
  store.dispatch(part_slice.actions.add(test_part));
  store.dispatch(part_slice.actions.addChild(['part_4', expected_part_content[0]]));
  expect(store.getState().part.entities.part_4?.contents).toEqual(expected_part_content);
});

test('part/reorderChild reducerの確認', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().part).toEqual(initial_part_state);
  const test_part: mPart = {
    type_signature: mPartSignature,
    id: 'part_6',
    parent: 'side_0',
    contents: ['point_1', 'point_2', 'point_3'],
  };
  const expected_part_content_1: mPart['contents'] = ['point_1', 'point_3', 'point_2'];
  store.dispatch(part_slice.actions.add(test_part));
  store.dispatch(part_slice.actions.reorderChild(['part_6', 'point_3', 'point_2']));
  expect(store.getState().part.entities.part_6?.contents).toEqual(expected_part_content_1);
  const expected_part_content_2: mPart['contents'] = ['point_3', 'point_2', 'point_1'];
  store.dispatch(part_slice.actions.reorderChild(['part_6', 'point_1', null]));
  expect(store.getState().part.entities.part_6?.contents).toEqual(expected_part_content_2);
});

test('part/setParent reducerの確認', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_part_state);
  const test_part_before: mPart = {
    type_signature: mPartSignature,
    id: 'part_0',
    parent: 'side_0',
    name: '1AC',
  };
  const test_part_after: mPart = {
    ...test_part_before,
    parent: 'side_new',
  };
  store.dispatch(part_slice.actions.add(test_part_before));
  store.dispatch(part_slice.actions.setParent(['part_0', 'side_new']));
  expect(store.getState().part.entities.part_0).toMatchObject(test_part_after);
});

test('part/incrementID reducerの確認', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().part).toEqual(initial_part_state);
  store.dispatch(part_slice.actions.incrementID());
  expect(store.getState().part.last_id_number).toBe(1);
});

test('generate_part_idの確認', () => {
  // storeの状態をリセット
  store.dispatch(part_slice.actions.reset());
  expect(store.getState().part).toEqual(initial_part_state);
  expect(generate_part_id()).toBe('part_0');
  expect(generate_part_id()).toBe('part_1');
});
