import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import {is_mPoint, mPoint,mPointSignature} from 'models/mPoint';
import { mEvidenceSignature } from 'models/mEvidence';
import {generate_point,point_add_child,append_claim,append_point_to_part, append_sibling_point, append_point_child} from 'services/point';
import {generate_part, part_add_child} from 'services/part';
import { mClaim, mClaimSignature } from 'models/mClaim';
import { generate_claim } from 'services/claim';
import { match_slice } from 'stores/slices/match';
import { side_slice } from 'stores/slices/side';
import { mMatch } from 'models/mMatch';
import { is_mPart, mPart } from 'models/mPart';
import { mSide } from 'models/mSide';
import { generate_match } from 'services/match';
import { generate_side } from 'services/side';
import { get_from_id } from 'services/id';
import { claim_slice } from 'stores/slices/claim';
import { is } from 'immer/dist/internal';

beforeEach(()=>{
  store.dispatch(match_slice.actions.reset());
  store.dispatch(side_slice.actions.reset());
  store.dispatch(part_slice.actions.reset());
  store.dispatch(point_slice.actions.reset());
  store.dispatch(claim_slice.actions.reset());
  store.dispatch(evidence_slice.actions.reset());
});

const generate_parents=():[mMatch['id_obj'], mSide['id_obj'], mPart['id_obj']]=>{
  const match=generate_match();
  const side=generate_side(match.id);
  const part=generate_part(side.id);
  return [match.id, side.id, part.id];
};

test('generate_point: 引数あり',()=>{
  const part_id=generate_parents()[2];
  const expected_result:Omit<mPoint,'id'> = {
    type_signature: mPointSignature,
    parent: part_id,
    numbering: 1,
  };
  const result=generate_point(part_id,expected_result)
  expect(result).toMatchObject(expected_result);
  expect(store.getState().point.entities[result.id]).toMatchObject(expected_result);
  const parent_in_redux=get_from_id(part_id);
  expect(is_mPart(parent_in_redux)).toBeTruthy();
  if(!is_mPart(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('generate_point: 引数なし',()=>{
  const part_id=generate_parents()[2];
  const expected_result:Omit<mPoint,'id'> = {
    type_signature: mPointSignature,
    parent: part_id,
  };
  const result=generate_point(part_id);
  expect(result).toMatchObject(expected_result);
  expect(store.getState().point.entities[result.id]).toMatchObject(expected_result);
  const parent_in_redux=get_from_id(part_id);
  expect(is_mPart(parent_in_redux)).toBeTruthy();
  if(!is_mPart(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('point_add_child: Evidence',()=>{
  const part_id=generate_parents()[2];
  const generated=generate_point('part_0');
  const modified=point_add_child(generated.id,mEvidenceSignature);
  const expected_result:Omit<mPoint,'id'> = {
    type_signature: mPointSignature,
    parent: part_id,
    contents: [modified.id],
  };
  expect(store.getState().point.entities[generated.id]).toMatchObject(expected_result);
  expect(store.getState().evidence.entities[modified.id]).toBeTruthy();
  const parent_in_redux=get_from_id(generated.id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if(!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});

test('point_add_child: Point',()=>{
  const part_id=generate_parents()[2];
  const generated=generate_point('part_0');
  const modified=point_add_child(generated.id,mPointSignature);
  const expected_result:Omit<mPoint,'id'> = {
    type_signature: mPointSignature,
    parent: part_id,
    contents: [modified.id],
  };
  expect(store.getState().point.entities[generated.id]).toMatchObject(expected_result);
  expect(store.getState().point.entities[modified.id]).toBeTruthy();
  const parent_in_redux=get_from_id(generated.id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if(!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});

test('append_claim: Point',()=>{
  const part_id=generate_parents()[2];
  const parent=generate_point(part_id);
  const modified=append_claim(parent.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const expected_result:Omit<mClaim,'id'> = {
    type_signature: mClaimSignature,
    parent: parent.id,
  };
  expect(store.getState().claim.entities[modified.id]).toMatchObject(expected_result);
  const parent_in_redux=get_from_id(parent.id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if(!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});

test('append_claim: Part',()=>{
  const part_id=generate_parents()[2];
  const modified=append_claim(part_id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().claim.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  const part_in_redux=get_from_id(part_id);
  expect(is_mPart(part_in_redux)).toBe(true);
  if(!is_mPart(part_in_redux)) return;
  expect(part_in_redux.contents).toBeTruthy();
  if(!part_in_redux.contents) return;
  expect(result_in_redux.parent).toBe(part_in_redux.contents[part_in_redux.contents.length-1]);
  const parent_in_redux=get_from_id(result_in_redux.parent);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if(!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});

test('append_claim: Claim',()=>{
  const part_id=generate_parents()[2];
  const parent=generate_point(part_id);
  const claim=generate_claim(parent.id);
  const modified=append_claim(claim.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().claim.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=get_from_id(parent.id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if(!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});

test('append_sibling_point: Point',()=>{
  const part_id=generate_parents()[2];
  const parent=get_from_id(part_id);
  expect(parent).toBeTruthy();
  if(!is_mPart(parent)) return;
  const sibling=generate_point(parent.id_obj);
  const old_parent_in_redux=store.getState().part.entities[parent.id_obj];
  expect(old_parent_in_redux?.contents).toContain(sibling.id);
  const modified=append_sibling_point(sibling.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id_obj];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id_obj);
  const modified_parent_in_redux=store.getState().part.entities[parent.id_obj];
  if(modified_parent_in_redux===undefined) return;
  expect(modified_parent_in_redux.contents).toEqual([...(parent.contents?parent.contents:[]), sibling.id, modified.id_obj]);
});

test('append_sibling_point: Part',()=>{
  const part_id=generate_parents()[2];
  const parent=get_from_id(part_id);
  expect(parent).toBeTruthy();
  if(!is_mPart(parent)) return;
  const sibling=generate_point(parent.id_obj);
  const old_parent_in_redux=store.getState().part.entities[parent.id_obj];
  expect(old_parent_in_redux?.contents).toContain(sibling.id);
  const modified=append_sibling_point(parent.id_obj);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id_obj];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id_obj);
  const parent_in_redux=store.getState().part.entities[parent.id_obj];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([...(parent.contents?parent.contents:[]), sibling.id, modified.id_obj]);
});

test('append_sibling_point: Claim',()=>{
  const part_id=generate_parents()[2];
  const parent=get_from_id(part_id);
  expect(parent).toBeTruthy();
  if(!is_mPart(parent)) return;
  const sibling=generate_point(parent.id_obj);
  const old_parent_in_redux=store.getState().part.entities[parent.id_obj];
  expect(old_parent_in_redux?.contents).toContain(sibling.id);
  const child_claim=generate_claim(sibling.id);
  const sibling_in_redux=store.getState().point.entities[sibling.id];
  expect(sibling_in_redux?.contents).toContain(child_claim.id);
  const modified=append_sibling_point(child_claim.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id_obj];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id_obj);
  const parent_in_redux=store.getState().part.entities[parent.id_obj];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([...(parent.contents?parent.contents:[]), sibling.id, modified.id_obj]);
});

test('append_point_to_part: Point', ()=>{
  const part_id=generate_parents()[2];
  const point1=part_add_child(part_id);
  const point2=point_add_child(point1.id, mPointSignature);
  const result=append_point_to_part(point2.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id_obj];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
  const part_in_redux=store.getState().part.entities[part_id];
  if(part_in_redux===undefined) return;
  expect(part_in_redux.contents).toContain(result.id_obj);
});

test('append_point_to_part: Part', ()=>{
  const part_id=generate_parents()[2];
  const result=append_point_to_part(part_id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id_obj];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
  const part_in_redux=store.getState().part.entities[part_id];
  if(part_in_redux===undefined) return;
  expect(part_in_redux.contents).toContain(result.id_obj);
});

test('append_point_to_part: Claim', ()=>{
  const part_id=generate_parents()[2];
  const point1=part_add_child(part_id);
  const claim=point_add_child(point1.id, mClaimSignature);
  const result=append_point_to_part(claim.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id_obj];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
  const part_in_redux=store.getState().part.entities[part_id];
  if(part_in_redux===undefined) return;
  expect(part_in_redux.contents).toContain(result.id_obj);
});

test('append_point_child: Point', ()=>{
  const part_id=generate_parents()[2];
  const parent=generate_point(part_id);
  const result=append_point_child(parent.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id_obj];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=store.getState().point.entities[parent.id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toContain(result.id_obj);
});

test('append_point_child: Part', ()=>{
  const part_id=generate_parents()[2];
  const sibling=generate_point(part_id);
  const result=append_point_child(part_id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id_obj];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(part_id);
  const parent_in_redux=store.getState().point.entities[part_id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([sibling.id,result.id_obj]);
});

test('append_point_child: Claim', ()=>{
  const part_id=generate_parents()[2];
  const parent=generate_point(part_id);
  const claim1=generate_claim(parent.id);
  const claim2=generate_claim(parent.id);
  const old_parent_in_redux=store.getState().point.entities[parent.id];
  expect(old_parent_in_redux).not.toBeUndefined();
  expect(old_parent_in_redux?.contents).toContain(claim1.id);
  expect(old_parent_in_redux?.contents).toContain(claim2.id);
  const result=append_point_child(claim1.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id_obj];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=store.getState().point.entities[parent.id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([claim1.id,result.id_obj,claim2.id]);
});
