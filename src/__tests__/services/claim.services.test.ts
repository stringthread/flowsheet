import { mClaim, mClaimSignature } from 'models/mClaim';
import { mMatch } from 'models/mMatch';
import { is_mPart, mPart } from 'models/mPart';
import { is_mPoint, mPoint } from 'models/mPoint';
import { mSide } from 'models/mSide';
import { append_claim, generate_claim } from 'services/claim';
import { get_from_id } from 'services/id';
import { generate_match } from 'services/match';
import { generate_part } from 'services/part';
import { generate_point } from 'services/point';
import { generate_side } from 'services/side';
import { store } from 'stores';
import { claim_slice } from 'stores/slices/claim';
import { match_slice } from 'stores/slices/match';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { side_slice } from 'stores/slices/side';

beforeEach(() => {
  store.dispatch(match_slice.actions.reset());
  store.dispatch(side_slice.actions.reset());
  store.dispatch(part_slice.actions.reset());
  store.dispatch(point_slice.actions.reset());
  store.dispatch(claim_slice.actions.reset());
});

const generate_parents = (): [mMatch['id'], mSide['id'], mPart['id'], mPoint['id']] => {
  const match = generate_match();
  const side = generate_side(match.id);
  const part = generate_part(side.id);
  const point = generate_point(part.id);
  return [match.id, side.id, part.id, point.id];
};

test('generate_claim: 引数あり', () => {
  const point_id = generate_parents()[3];
  const expected_result: Omit<mClaim, 'id'> = {
    type_signature: mClaimSignature,
    parent: point_id,
  };
  const result = generate_claim(point_id, expected_result);
  expect(result).toMatchObject(expected_result);
  expect(store.getState().claim.entities[result.id]).toMatchObject(expected_result);
  const parent_in_redux = get_from_id(point_id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if (!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('generate_claim: 引数なし', () => {
  const point_id = generate_parents()[3];
  const expected_result: Omit<mClaim, 'id'> = {
    type_signature: mClaimSignature,
    parent: point_id,
  };
  const result = generate_claim(point_id);
  expect(result).toMatchObject(expected_result);
  expect(store.getState().claim.entities[result.id]).toMatchObject(expected_result);
  const parent_in_redux = get_from_id(point_id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if (!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(result.id);
});

test('append_claim: Point', () => {
  const part_id = generate_parents()[2];
  const parent = generate_point(part_id);
  const modified = append_claim(parent.id);
  expect(modified).not.toBeUndefined();
  if (modified === undefined) return;
  const expected_result: Omit<mClaim, 'id'> = {
    type_signature: mClaimSignature,
    parent: parent.id,
  };
  expect(store.getState().claim.entities[modified.id]).toMatchObject(expected_result);
  const parent_in_redux = get_from_id(parent.id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if (!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});

test('append_claim: Part', () => {
  const part_id = generate_parents()[2];
  const modified = append_claim(part_id);
  expect(modified).not.toBeUndefined();
  if (modified === undefined) return;
  const result_in_redux = store.getState().claim.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if (result_in_redux === undefined) return;
  const part_in_redux = get_from_id(part_id);
  expect(is_mPart(part_in_redux)).toBe(true);
  if (!is_mPart(part_in_redux)) return;
  expect(part_in_redux.contents).toBeTruthy();
  if (!part_in_redux.contents) return;
  expect(result_in_redux.parent).toBe(part_in_redux.contents[part_in_redux.contents.length - 1]);
  const parent_in_redux = get_from_id(result_in_redux.parent);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if (!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});

test('append_claim: Claim', () => {
  const part_id = generate_parents()[2];
  const parent = generate_point(part_id);
  const claim = generate_claim(parent.id);
  const modified = append_claim(claim.id);
  expect(modified).not.toBeUndefined();
  if (modified === undefined) return;
  const result_in_redux = store.getState().claim.entities[modified.id];
  expect(result_in_redux).toBeTruthy();
  if (result_in_redux === undefined) return;
  expect(result_in_redux.parent).toBe(parent.id);
  const parent_in_redux = get_from_id(parent.id);
  expect(is_mPoint(parent_in_redux)).toBeTruthy();
  if (!is_mPoint(parent_in_redux)) return;
  expect(parent_in_redux.contents).toContain(modified.id);
});
