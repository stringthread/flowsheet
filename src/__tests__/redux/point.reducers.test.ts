import {store} from 'stores/index';
import {EntityStateWithLastID} from 'stores/slices/EntityStateWithLastID';
import {point_slice} from 'stores/slices/point';
import {generate_point_id} from 'stores/ids/id_generators';
import {mPoint,mPointSignature} from 'models/mPoint';

const initial_point_state: EntityStateWithLastID<mPoint>={
  ids: [],
  entities: {},
  last_id_number: 0
}

test('point/removeAll reducerの確認',()=>{
  const test_point: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_2',
    parent: 'part_0',
    numbering: 1
  };
  store.dispatch(point_slice.actions.add(test_point));
  store.dispatch(point_slice.actions.removeAll());
  expect(store.getState().point).toEqual(initial_point_state);
});

test('point/add reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().point).toEqual(initial_point_state);
  const test_point: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_0',
    parent: 'part_0',
    numbering: 1
  };
  const expected_point_state: EntityStateWithLastID<mPoint>={
    ids: ['point_0'],
    entities: {
      point_0:test_point
    },
    last_id_number: 0
  }
  store.dispatch(point_slice.actions.add(test_point));
  expect(store.getState().point).toMatchObject(expected_point_state);
});

test('point/upsertOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_point_state);
  const test_point_before: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_0',
    parent: 'part_0',
    numbering: 0,
  };
  const test_point_after: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_0',
    parent: 'part_0',
    numbering: 1,
  };
  store.dispatch(point_slice.actions.add(test_point_before));
  store.dispatch(point_slice.actions.upsertOne(test_point_after));
  expect(store.getState().point.entities.point_0).toMatchObject(test_point_after);
});

test('point/removeOne reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().point).toEqual(initial_point_state);
  const test_point: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_1',
    parent: 'part_0',
    numbering: 1
  };
  const test_point_2: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_2',
    parent: 'part_0',
    numbering: 2
  };
  const expected_point_state: EntityStateWithLastID<mPoint>={
    ids: ['point_2'],
    entities: {
      point_2: test_point_2
    },
    last_id_number: 0
  }
  store.dispatch(point_slice.actions.add(test_point));
  store.dispatch(point_slice.actions.add(test_point_2));
  store.dispatch(point_slice.actions.removeOne('point_1'));
  expect(store.getState().point).toMatchObject(expected_point_state);
});

test('point/addChild reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().point).toEqual(initial_point_state);
  const test_point: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_3',
    parent: 'part_0',
    contents: ['evi_0']
  };
  const expected_point_content: mPoint['contents']=['evi_0','point_1']
  store.dispatch(point_slice.actions.add(test_point));
  store.dispatch(point_slice.actions.addChild(['point_3',expected_point_content[1]]));
  expect(store.getState().point.entities.point_3?.contents).toEqual(expected_point_content);
});

test('point/addChild reducer: contentsが空のとき',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().point).toEqual(initial_point_state);
  const test_point: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_4',
    parent: 'part_0',
  };
  const expected_point_content: mPoint['contents']=['evi_0']
  store.dispatch(point_slice.actions.add(test_point));
  store.dispatch(point_slice.actions.addChild(['point_4',expected_point_content[0]]));
  expect(store.getState().point.entities.point_4?.contents).toEqual(expected_point_content);
});

test('point/reorderChild reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().point).toEqual(initial_point_state);
  const test_point: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_6',
    parent: 'part_0',
    contents: ['evi_0','point_1','evi_1']
  };
  const expected_point_content_1: mPoint['contents']=['evi_0','evi_1','point_1'];
  store.dispatch(point_slice.actions.add(test_point));
  store.dispatch(point_slice.actions.reorderChild(['point_6','evi_1','point_1']));
  expect(store.getState().point.entities.point_6?.contents).toEqual(expected_point_content_1);
  const expected_point_content_2: mPoint['contents']=['evi_0','evi_1','point_1'];
  store.dispatch(point_slice.actions.reorderChild(['point_6','point_1',null]));
  expect(store.getState().point.entities.point_6?.contents).toEqual(expected_point_content_2);
});

test('point/setParent reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().match).toEqual(initial_point_state);
  const test_point_before: mPoint={
    type_signature: mPointSignature,
    id_obj: 'point_0',
    parent: 'part_0',
    numbering: 0,
  };
  const test_point_after: mPoint={
    ...test_point_before,
    parent: 'part_new'
  };
  store.dispatch(point_slice.actions.add(test_point_before));
  store.dispatch(point_slice.actions.setParent(['point_0','part_new']));
  expect(store.getState().point.entities.point_0).toMatchObject(test_point_after);
});

test('point/incrementID reducerの確認',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().point).toEqual(initial_point_state);
  store.dispatch(point_slice.actions.incrementID());
  expect(store.getState().point.last_id_number).toBe(1);
});

test('generate_point_idの確認',()=>{
  // storeの状態をリセット
  store.dispatch(point_slice.actions.reset());
  expect(store.getState().point).toEqual(initial_point_state);
  expect(generate_point_id()).toBe('point_0');
  expect(generate_point_id()).toBe('point_1');
});
