import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import {mPoint,mPointSignature} from 'models/mPoint';
import {generate_point,point_add_child,append_claim,append_point,append_point_to_part} from 'services/point';
import {generate_part, part_add_child} from 'services/part';

beforeEach(()=>{
  store.dispatch(part_slice.actions.reset());
  store.dispatch(point_slice.actions.reset());
  store.dispatch(evidence_slice.actions.reset());
});

test('generate_point: 引数あり',()=>{
  const expected_result:mPoint = {
    type_signature: mPointSignature,
    id: 'point_0',
    parent: 'part_0',
    numbering: 1,
  };
  expect(generate_point('part_0',expected_result)).toEqual(expected_result);
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
});

test('generate_point: 引数なし',()=>{
  const expected_result:mPoint = {
    type_signature: mPointSignature,
    id: 'point_0',
    parent: 'part_0',
  };
  expect(generate_point('part_0')).toEqual(expected_result);
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
});

test('point_add_child: Evidence',()=>{
  const expected_result:mPoint = {
    type_signature: mPointSignature,
    id: 'point_0',
    parent: 'part_0',
    contents: [['evi_0',false]],
  };
  const generated=generate_point('part_0');
  const modified=point_add_child(generated.id,false);
  expect(modified.id).toBe('evi_0');
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
  expect(store.getState().evidence.entities['evi_0']).toBeTruthy();
});

test('point_add_child: Point',()=>{
  const expected_result:mPoint = {
    type_signature: mPointSignature,
    id: 'point_0',
    parent: 'part_0',
    contents: [['point_1',true]],
  };
  const generated=generate_point('part_0');
  const modified=point_add_child(generated.id,true);
  expect(modified.id).toBe('point_1');
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
  expect(store.getState().point.entities['point_1']).toBeTruthy();
});

test('append_claim: Point',()=>{
  const parent=generate_point('part_0');
  const expected_result:mPoint = {
    type_signature: mPointSignature,
    id: 'point_1',
    parent: parent.id,
    contents: '',
  };
  const modified=append_claim(parent.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  expect(modified.id).toBe('point_1');
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
});

test('append_claim: Part',()=>{
  const parent=generate_part('side_0');
  const modified=append_claim(parent.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).toBe('');
});

test('append_point: Point',()=>{
  const parent=generate_point('part_0');
  const modified=append_point(parent.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
});

test('append_point: Part',()=>{
  const parent=generate_part('side_0');
  const modified=append_point(parent.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
});

test('append_point_to_part: Point', ()=>{
  const part=generate_part('side_0');
  const point1=part_add_child(part.id);
  const point2=point_add_child(point1.id, true);
  const result=append_point_to_part(point2.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
  const part_in_redux=store.getState().part.entities[part.id];
  if(part_in_redux===undefined) return;
  expect(part_in_redux.contents).toContain(result.id);
});

test('append_point_to_part: Part', ()=>{
  const part=generate_part('side_0');
  const result=append_point_to_part(part.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
  const part_in_redux=store.getState().part.entities[part.id];
  if(part_in_redux===undefined) return;
  expect(part_in_redux.contents).toContain(result.id);
});
