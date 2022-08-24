import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import {is_mPoint, mPoint,mPointSignature} from 'models/mPoint';
import { mEvidenceSignature } from 'models/mEvidence';
import {generate_point,point_add_child,append_point_to_part, append_sibling_point, append_point_child, set_rebut, add_rebut, set_rebut_to, add_rebut_to, append_point_to_parent, reorder_child} from 'services/point';
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
import { ValidationError } from 'errors';

beforeEach(()=>{
  store.dispatch(match_slice.actions.reset());
  store.dispatch(side_slice.actions.reset());
  store.dispatch(part_slice.actions.reset());
  store.dispatch(point_slice.actions.reset());
  store.dispatch(claim_slice.actions.reset());
  store.dispatch(evidence_slice.actions.reset());
});

const generate_parents=():[mMatch['id'], mSide['id'], mPart['id']]=>{
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
    contents: [...(generated.contents??[]), modified.id],
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
    contents: [...(generated.contents??[]), modified.id],
  };
  expect(store.getState().point.entities[generated.id]).toMatchObject(expected_result);
  expect(store.getState().point.entities[modified.id]).toBeTruthy();
  const parent_in_redux=get_from_id(generated.id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if(!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});

test('reorder_child', ()=>{
  const part_id = generate_parents()[2];
  const parent=get_from_id(part_id);
  expect(parent).toBeDefined();
  if(!is_mPart(parent)) return;
  const point1 = generate_point(part_id);
  const point2 = generate_point(part_id);
  const point3 = generate_point(part_id);
  const point4 = generate_point(part_id);
  const old_parent_in_redux=store.getState().part.entities[part_id];
  expect(old_parent_in_redux).toBeDefined();
  if(old_parent_in_redux===undefined) return;
  expect(old_parent_in_redux.contents).toEqual([...(parent.contents??[]), point1.id, point2.id, point3.id, point4.id]);
  reorder_child(part_id, point3.id, point2.id);
  const modified_parent_in_redux=store.getState().part.entities[part_id];
  expect(modified_parent_in_redux).toBeDefined();
  if(modified_parent_in_redux===undefined) return;
  expect(modified_parent_in_redux.contents).toEqual([...(parent.contents??[]), point1.id, point3.id, point2.id, point4.id]);
});

test('append_sibling_point: Point',()=>{
  const part_id=generate_parents()[2];
  const parent=get_from_id(part_id);
  expect(parent).toBeTruthy();
  if(!is_mPart(parent)) return;
  const sibling=generate_point(parent.id);
  const sibling_after=generate_point(parent.id);
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
  expect(modified_parent_in_redux.contents).toEqual([...(parent.contents?parent.contents:[]), sibling.id, modified.id, sibling_after.id]);
});

test('append_sibling_point: Part',()=>{
  const part_id=generate_parents()[2];
  const parent=get_from_id(part_id);
  expect(parent).toBeTruthy();
  if(!is_mPart(parent)) return;
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
  const part_id=generate_parents()[2];
  const parent=get_from_id(part_id);
  expect(parent).toBeTruthy();
  if(!is_mPart(parent)) return;
  const sibling=generate_point(parent.id);
  const old_parent_in_redux=store.getState().part.entities[parent.id];
  expect(old_parent_in_redux?.contents).toContain(sibling.id);
  const child_claim=generate_claim(sibling.id);
  const sibling_in_redux=store.getState().point.entities[sibling.id];
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

test('append_point_to_parent: depth 1. Point',()=>{
  const part_id=generate_parents()[2];
  const part=get_from_id(part_id);
  expect(part).toBeTruthy();
  if(!is_mPart(part)) return;
  const sibling=generate_point(part.id);
  const sibling_after=generate_point(part.id);
  const old_part_in_redux=store.getState().part.entities[part.id];
  expect(old_part_in_redux?.contents).toContain(sibling.id);
  expect(old_part_in_redux?.contents).toContain(sibling_after.id);
  const modified=append_point_to_parent(sibling.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(part.id);
  const modified_part_in_redux=store.getState().part.entities[part.id];
  if(modified_part_in_redux===undefined) return;
  expect(modified_part_in_redux.contents).toEqual([...(part.contents?part.contents:[]), sibling.id, modified.id, sibling_after.id]);
});

test('append_point_to_parent: depth 2. Point',()=>{
  const part_id=generate_parents()[2];
  const part=get_from_id(part_id);
  expect(part).toBeTruthy();
  if(!is_mPart(part)) return;
  const parent=generate_point(part.id);
  const sibling=generate_point(parent.id);
  const parent_after=generate_point(part.id);
  const old_parent_in_redux=store.getState().part.entities[part.id];
  expect(old_parent_in_redux?.contents).toContain(parent.id);
  expect(old_parent_in_redux?.contents).not.toContain(sibling.id);
  expect(old_parent_in_redux?.contents).toContain(parent_after.id);
  const modified=append_point_to_parent(sibling.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(part.id);
  const modified_parent_in_redux=store.getState().part.entities[part.id];
  if(modified_parent_in_redux===undefined) return;
  expect(modified_parent_in_redux.contents).toEqual([...(part.contents?part.contents:[]), parent.id, modified.id, parent_after.id]);
});

test('append_point_to_parent: depth 3. Point',()=>{
  const part_id=generate_parents()[2];
  const part=get_from_id(part_id);
  expect(part).toBeTruthy();
  if(!is_mPart(part)) return;
  const grandparent=generate_point(part.id);
  const parent=generate_point(grandparent.id);
  const sibling=generate_point(parent.id);
  const parent_after=generate_point(grandparent.id);
  const old_parent_in_redux=store.getState().point.entities[grandparent.id];
  expect(old_parent_in_redux?.contents).toContain(parent.id);
  expect(old_parent_in_redux?.contents).toContain(parent_after.id);
  const modified=append_point_to_parent(sibling.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(grandparent.id);
  const modified_parent_in_redux=store.getState().point.entities[grandparent.id];
  if(modified_parent_in_redux===undefined) return;
  expect(modified_parent_in_redux.contents).toEqual([...(grandparent.contents?grandparent.contents:[]), parent.id, modified.id, parent_after.id]);
});

test('append_point_to_parent: Part',()=>{
  const part_id=generate_parents()[2];
  const parent=get_from_id(part_id);
  expect(parent).toBeTruthy();
  if(!is_mPart(parent)) return;
  const sibling=generate_point(parent.id);
  const old_parent_in_redux=store.getState().part.entities[parent.id];
  expect(old_parent_in_redux?.contents).toContain(sibling.id);
  const modified=append_point_to_parent(parent.id);
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

test('append_point_to_parent: Claim in depth 3. Point',()=>{
  const part_id=generate_parents()[2];
  const part=get_from_id(part_id);
  expect(part).toBeTruthy();
  if(!is_mPart(part)) return;
  const primary=generate_point(part.id);
  const secondary=generate_point(primary.id);
  const tertiary=generate_point(secondary.id);
  const claim=generate_claim(tertiary.id);
  const secondary_after=generate_point(primary.id);
  const old_parent_in_redux=store.getState().point.entities[primary.id];
  expect(old_parent_in_redux?.contents).toContain(secondary.id);
  expect(old_parent_in_redux?.contents).toContain(secondary_after.id);
  const modified=append_point_to_parent(claim.id);
  expect(modified).not.toBeUndefined();
  if(modified===undefined) return;
  const result_in_redux=store.getState().point.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(primary.id);
  const modified_parent_in_redux=store.getState().point.entities[primary.id];
  if(modified_parent_in_redux===undefined) return;
  expect(modified_parent_in_redux.contents).toEqual([...(primary.contents?primary.contents:[]), secondary.id, modified.id, secondary_after.id]);
});

test('append_point_to_part: Point', ()=>{
  const part_id=generate_parents()[2];
  const point1=part_add_child(part_id);
  const point2=point_add_child(point1.id, mPointSignature);
  const result=append_point_to_part(point2.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
  const part_in_redux=store.getState().part.entities[part_id];
  if(part_in_redux===undefined) return;
  expect(part_in_redux.contents).toContain(result.id);
});

test('append_point_to_part: Part', ()=>{
  const part_id=generate_parents()[2];
  const result=append_point_to_part(part_id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
  const part_in_redux=store.getState().part.entities[part_id];
  if(part_in_redux===undefined) return;
  expect(part_in_redux.contents).toContain(result.id);
});

test('append_point_to_part: Claim', ()=>{
  const part_id=generate_parents()[2];
  const point1=part_add_child(part_id);
  const claim=point_add_child(point1.id, mClaimSignature);
  const result=append_point_to_part(claim.id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.contents).not.toBe('');
  const part_in_redux=store.getState().part.entities[part_id];
  if(part_in_redux===undefined) return;
  expect(part_in_redux.contents).toContain(result.id);
});

test('append_point_child: Point', ()=>{
  const part_id=generate_parents()[2];
  const parent=generate_point(part_id);
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
  const part_id=generate_parents()[2];
  const sibling=generate_point(part_id);
  const result=append_point_child(part_id);
  expect(result).not.toBeUndefined();
  if(result===undefined) return;
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(part_id);
  const parent_in_redux=store.getState().point.entities[part_id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([sibling.id,result.id]);
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
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).not.toBeUndefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux=store.getState().point.entities[parent.id];
  if(parent_in_redux===undefined) return;
  expect(parent_in_redux.contents).toEqual([...(parent.contents??[]), claim1.id,result.id,claim2.id]);
});

test('set_rebut: mPoint1<-mPoint2', ()=>{
  const [_,side_id,part1_id]=generate_parents();
  const point1=generate_point(part1_id);
  const part2=generate_part(side_id);
  const point2=generate_point(part2.id);
  set_rebut(point1.id,point2.id);
  const point1_in_redux=store.getState().point.entities[point1.id];
  expect(point1_in_redux).toBeDefined();
  if(point1_in_redux===undefined) return;
  expect(point1_in_redux.rebut_to).toBeUndefined();
  const point2_in_redux=store.getState().point.entities[point2.id];
  expect(point2_in_redux).toBeDefined();
  if(point2_in_redux===undefined) return;
  expect(point2_in_redux.rebut_to).toBe(point1.id);
});
test('set_rebut: mPoint2->mPoint1', ()=>{
  const [_,side_id,part1_id]=generate_parents();
  const point1=generate_point(part1_id);
  const part2=generate_part(side_id);
  const point2=generate_point(part2.id);
  set_rebut(point2.id,point1.id);
  const point1_in_redux=store.getState().point.entities[point1.id];
  expect(point1_in_redux).toBeDefined();
  if(point1_in_redux===undefined) return;
  expect(point1_in_redux.rebut_to).toBeUndefined();
  const point2_in_redux=store.getState().point.entities[point2.id];
  expect(point2_in_redux).toBeDefined();
  if(point2_in_redux===undefined) return;
  expect(point2_in_redux.rebut_to).toBe(point1.id);
});
test('set_rebut: mClaim<-mPoint', ()=>{
  const [_,side_id,part1_id]=generate_parents();
  const point1=generate_point(part1_id);
  const claim=generate_claim(point1.id);
  const part2=generate_part(side_id);
  const point2=generate_point(part2.id);
  set_rebut(claim.id,point2.id);
  const point2_in_redux=store.getState().point.entities[point2.id];
  expect(point2_in_redux).toBeDefined();
  if(point2_in_redux===undefined) return;
  expect(point2_in_redux.rebut_to).toBe(claim.id);
});
test('set_rebut_to mPoint1<-mPoint2', ()=>{
  const [_,side_id,part1_id]=generate_parents();
  const point1=generate_point(part1_id);
  const part2=generate_part(side_id);
  const point2=generate_point(part2.id);
  const _set_rebut_to=set_rebut_to(point2.id);
  _set_rebut_to(point1.id);
  const point1_in_redux=store.getState().point.entities[point1.id];
  expect(point1_in_redux).toBeDefined();
  if(point1_in_redux===undefined) return;
  expect(point1_in_redux.rebut_to).toBeUndefined();
  const point2_in_redux=store.getState().point.entities[point2.id];
  expect(point2_in_redux).toBeDefined();
  if(point2_in_redux===undefined) return;
  expect(point2_in_redux.rebut_to).toBe(point1.id);
});
test('set_rebut_to mPoint1->mPoint2', ()=>{
  const [_,side_id,part1_id]=generate_parents();
  const point1=generate_point(part1_id);
  const part2=generate_part(side_id);
  const point2=generate_point(part2.id);
  const _set_rebut_to=set_rebut_to(point1.id);
  _set_rebut_to(point2.id);
  const point1_in_redux=store.getState().point.entities[point1.id];
  expect(point1_in_redux).toBeDefined();
  if(point1_in_redux===undefined) return;
  expect(point1_in_redux.rebut_to).toBeUndefined();
  const point2_in_redux=store.getState().point.entities[point2.id];
  expect(point2_in_redux).toBeDefined();
  if(point2_in_redux===undefined) return;
  expect(point2_in_redux.rebut_to).toBe(point1.id);
});

test('add_rebut', ()=>{
  const [_,side_id,part1_id]=generate_parents();
  const point1=generate_point(part1_id);
  const part2=generate_part(side_id);
  const result=add_rebut(point1.id, part2.id);
  const point1_in_redux=store.getState().point.entities[point1.id];
  expect(point1_in_redux).toBeDefined();
  if(point1_in_redux===undefined) return;
  expect(point1_in_redux.rebut_to).toBeUndefined();
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).toBeDefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.rebut_to).toBe(point1.id);
});

test('add_rebut - invalid: to later part', ()=>{
  const [_,side_id,part1_id]=generate_parents();
  const part2=generate_part(side_id);
  const point1=generate_point(part2.id);
  expect(()=>add_rebut(point1.id, part1_id)).toThrow(ValidationError);
  const point1_in_redux=store.getState().point.entities[point1.id];
  expect(point1_in_redux).toBeDefined();
  if(point1_in_redux===undefined) return;
  expect(point1_in_redux.rebut_to).toBeUndefined();
});

test('add_rebut_to', ()=>{
  const [_,side_id,part1_id]=generate_parents();
  const point1=generate_point(part1_id);
  const part2=generate_part(side_id);
  const _add_rebut_to=add_rebut_to(part2.id);
  const result=_add_rebut_to(point1.id);
  const point1_in_redux=store.getState().point.entities[point1.id];
  expect(point1_in_redux).toBeDefined();
  if(point1_in_redux===undefined) return;
  expect(point1_in_redux.rebut_to).toBeUndefined();
  const result_in_redux=store.getState().point.entities[result.id];
  expect(result_in_redux).toBeDefined();
  if(result_in_redux===undefined) return;
  expect(result_in_redux.rebut_to).toBe(point1.id);
});
