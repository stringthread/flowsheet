import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import {mPoint,mPointSignature} from 'models/mPoint';
import { mEvidenceSignature } from 'models/mEvidence';
import {generate_point,point_add_child,append_claim,append_point_to_part, append_sibling_point, append_point_child} from 'services/point';
import {generate_part, part_add_child} from 'services/part';
import { mClaim, mClaimSignature } from 'models/mClaim';
import { generate_claim } from 'services/claim';

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
    contents: ['evi_0'],
  };
  const generated=generate_point('part_0');
  const modified=point_add_child(generated.id,mEvidenceSignature);
  expect(modified.id).toBe('evi_0');
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
  expect(store.getState().evidence.entities['evi_0']).toBeTruthy();
});

test('point_add_child: Point',()=>{
  const expected_result:mPoint = {
    type_signature: mPointSignature,
    id: 'point_0',
    parent: 'part_0',
    contents: ['point_1'],
  };
  const generated=generate_point('part_0');
  const modified=point_add_child(generated.id,mPointSignature);
  expect(modified.id).toBe('point_1');
  expect(store.getState().point.entities[expected_result.id]).toEqual(expected_result);
  expect(store.getState().point.entities['point_1']).toBeTruthy();
});

test('append_claim: Point',()=>{
  const parent=generate_point('part_0');
  const expected_result:mClaim = {
    type_signature: mClaimSignature,
    id: 'claim_0',
    parent: parent.id,
  };
  const modified=append_claim(parent.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  expect(modified.id).toBe(expected_result.id);
  expect(store.getState().claim.entities[expected_result.id]).toEqual(expected_result);
});

test('append_claim: Part',()=>{
  const parent=generate_part('side_0');
  const modified=append_claim(parent.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().claim.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe('point_1');
});

test('append_claim: Claim',()=>{
  const parent=generate_point('side_0');
  const claim=generate_claim(parent.id);
  const modified=append_claim(claim.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().claim.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
});

test('append_sibling_point: Point',()=>{
  const parent=generate_part('side_0');
  const sibling=generate_point(parent.id);
  const old_parent_in_redux=store.getState().part.entities[parent.id];
  expect(old_parent_in_redux?.contents).toContain(sibling.id);
  const modified=append_sibling_point(sibling.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const modified_parent_in_redux=store.getState().part.entities[parent.id];
  if(modified_parent_in_redux===undefined) return;
  expect(modified_parent_in_redux.contents).toEqual([...(parent.contents?parent.contents:[]), sibling.id, modified.id]);
});

test('append_sibling_point: Part',()=>{
  const parent=generate_part('side_0');
  const sibling=generate_point(parent.id);
  const old_parent_in_redux=store.getState().part.entities[parent.id];
  expect(old_parent_in_redux?.contents).toContain(sibling.id);
  const modified=append_sibling_point(parent.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=store.getState().part.entities[parent.id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([...(parent.contents?parent.contents:[]), sibling.id, modified.id]);
});

test('append_sibling_point: Claim',()=>{
  const parent=generate_part('side_0');
  const sibling=generate_point(parent.id);
  const old_parent_in_redux=store.getState().part.entities[parent.id];
  expect(old_parent_in_redux?.contents).toContain(sibling.id);
  const child_claim=generate_claim(sibling.id);
  const sibling_in_redux=store.getState().part.entities[sibling.id];
  expect(sibling_in_redux?.contents).toContain(child_claim.id);
  const modified=append_sibling_point(child_claim.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=store.getState().part.entities[parent.id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([...(parent.contents?parent.contents:[]), sibling.id, modified.id]);
});

test('append_point_to_part: Point', ()=>{
  const part=generate_part('side_0');
  const point1=part_add_child(part.id);
  const point2=point_add_child(point1.id, mPointSignature);
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

test('append_point_to_part: Claim', ()=>{
  const part=generate_part('side_0');
  const point1=part_add_child(part.id);
  const claim=point_add_child(point1.id, mClaimSignature);
  const result=append_point_to_part(claim.id);
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

test('append_point_child: Point', ()=>{
  const parent=generate_point('part_0');
  const result=append_point_child(parent.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=store.getState().point.entities[parent.id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('append_point_child: Part', ()=>{
  const parent=generate_part('side_0');
  const sibling=generate_point(parent.id);
  const result=append_point_child(parent.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=store.getState().point.entities[parent.id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([sibling.id,result.id]);
});

test('append_point_child: Claim', ()=>{
  const parent=generate_point('part_0');
  const claim1=generate_claim(parent.id);
  const claim2=generate_claim(parent.id);
  const old_parent_in_redux=store.getState().point.entities[parent.id];
  expect(old_parent_in_redux).not.toBeUndefined();
  expect(old_parent_in_redux?.contents).toContain(claim1.id);
  expect(old_parent_in_redux?.contents).toContain(claim2.id);
  const result=append_point_child(claim1.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=store.getState().point.entities[parent.id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([claim1.id,result.id,claim2.id]);
});
