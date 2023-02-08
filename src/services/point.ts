import { generate_claim } from './claim';
import { generate_evidence } from './evidence';
import {
  get_parent_id,
  next_content_id,
  id_to_store,
  id_to_type,
  type_to_store,
  get_from_id,
  id_to_slice,
  compare_id,
} from './id';
import { part_add_child } from './part';
import { ValidationError } from 'errors';
import { baseModel } from 'models/baseModel';
import { id_is_mClaim, mClaim, mClaimSignature } from 'models/mClaim';
import { id_is_mEvidence, mEvidence, mEvidenceSignature } from 'models/mEvidence';
import { mMatchSignature } from 'models/mMatch';
import { id_is_mPart, is_mPart, mPart, part_id_prefix } from 'models/mPart';
import {
  id_is_mPoint,
  id_is_PointChild,
  is_mPoint,
  mPoint,
  mPointSignature,
  PointChild,
  PointParent,
} from 'models/mPoint';
import { store } from 'stores';
import { generate_point_id } from 'stores/ids/id_generators';
import { claim_slice } from 'stores/slices/claim';
import { evidence_slice } from 'stores/slices/evidence';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { assertNever } from 'util/utilityTypes';

export const generate_point = (
  parent: mPoint['parent'],
  from?: Partial<Omit<mPoint, 'type_signature' | 'id' | 'parent'>>,
  empty: boolean = false,
): mPoint => {
  const parent_obj = get_from_id(parent);
  if (!is_mPart(parent_obj) && !is_mPoint(parent_obj)) throw TypeError('argument `parent` does not match mPart|mPoint');
  const generated: mPoint = {
    ...from,
    type_signature: mPointSignature,
    id: generate_point_id(),
    parent,
  };
  store.dispatch(point_slice.actions.add(generated));
  if (id_is_mPart(parent)) store.dispatch(id_to_slice(parent).actions.addChild([parent, generated.id]));
  else store.dispatch(id_to_slice(parent).actions.addChild([parent, generated.id])); // NOTE: 同じ処理だが型推論を利かせるために分けている
  if (!empty) generate_claim(generated.id);
  return get_from_id(generated.id) || generated;
};

export function point_add_child(parent_id: mPoint['id'], type: mPoint['type_signature']): mPoint;
export function point_add_child(parent_id: mPoint['id'], type: mClaim['type_signature']): mClaim;
export function point_add_child(parent_id: mPoint['id'], type: mEvidence['type_signature']): mEvidence;
export function point_add_child(
  parent_id: mPoint['id'],
  type: baseModel['type_signature'],
): mPoint | mEvidence | mClaim {
  let child: mPoint | mEvidence | mClaim;
  if (type === mPointSignature) {
    child = generate_point(parent_id);
    store.dispatch(point_slice.actions.add(child));
  } else if (type === mEvidenceSignature) {
    child = generate_evidence(parent_id);
    store.dispatch(evidence_slice.actions.add(child));
  } else {
    child = generate_claim(parent_id);
    store.dispatch(claim_slice.actions.add(child));
  }
  return child;
}
export const point_set_child = (parent_id: mPoint['id'], child_id: PointChild['id']): void => {
  store.dispatch(point_slice.actions.addChild([parent_id, child_id]));
};

export const reorder_child: {
  (parent: mPoint['id'], target: PointChild['id'], before: PointChild['id'] | null): void;
  (parent: mPart['id'], target: mPoint['id'], before: mPoint['id'] | null): void;
} = (parent: PointParent['id'], target: PointChild['id'], before: PointChild['id'] | null): void => {
  if (!id_is_mPoint(parent) && !id_is_mPart(parent)) throw TypeError('argument `parent` does not match mPoint|mPart');
  if (id_is_mPoint(parent)) store.dispatch(point_slice.actions.reorderChild([parent, target, before]));
  else {
    if (!id_is_mPoint(target)) throw TypeError('argument `target` does not match mPoint (parent is mPart)');
    if (before !== null && !id_is_mPoint(before))
      throw TypeError('argument `before` does not match mPoint|null (parent is mPart)');
    store.dispatch(part_slice.actions.reorderChild([parent, target, before]));
  }
};

export const get_ancestor_point = (descendent_id: PointChild['id']): mPoint['id'] | undefined => {
  let parent_id: typeof descendent_id | null | undefined = descendent_id;
  while (parent_id && !id_is_mPoint(parent_id)) {
    parent_id = get_parent_id(parent_id);
  }
  return parent_id ?? undefined;
};
export const get_ancestor_part = (descendent_id: mPart['id'] | PointChild['id']): mPart['id'] | undefined => {
  let parent_id: typeof descendent_id | null | undefined = descendent_id;
  while (parent_id && !id_is_mPart(parent_id)) {
    parent_id = get_parent_id(parent_id);
  }
  return parent_id ?? undefined;
};
export type switch_for_append_id = mPart['id'] | mPoint['id'] | mClaim['id'] | mEvidence['id'];
export const is_switch_for_append_id = (v: unknown): v is switch_for_append_id => {
  return id_is_mPart(v) || id_is_mPoint(v) || id_is_mClaim(v) || id_is_mEvidence(v);
};
export const switch_for_append = <T>(
  id: switch_for_append_id,
  part: (id: mPart['id']) => T,
  claim_evi: (id: mClaim['id'] | mEvidence['id']) => T,
  point: (id: mPoint['id']) => T,
): T | undefined => {
  if (id_is_mPart(id)) return part(id);
  if (id_is_mEvidence(id) || id_is_mClaim(id)) return claim_evi(id);
  if (id_is_mPoint(id)) return point(id);
};
export const append_sibling_point = (parent_id: switch_for_append_id): mPoint | undefined => {
  return switch_for_append(
    parent_id,
    (id) => part_add_child(id),
    (id) => {
      const parent_id = get_parent_id(id);
      if (parent_id === undefined || parent_id === null) return;
      return append_sibling_point(parent_id);
    },
    (id) => {
      const parent_id = get_parent_id(id);
      if (parent_id === undefined || parent_id === null) return;
      return switch_for_append<mPoint | undefined>(
        parent_id,
        (parent_id) => {
          const child = id_is_mPoint(parent_id)
            ? point_add_child(parent_id, mPointSignature)
            : part_add_child(parent_id);
          const reorder_before = next_content_id(id) as mPoint['id'] | undefined;
          if (reorder_before === undefined) return;
          reorder_child(parent_id, child.id, reorder_before);
          return child;
        },
        (parent_id) => {
          throw TypeError('parent_id does not match mPart|mPoint');
        },
        (parent_id) => {
          const child = id_is_mPoint(parent_id)
            ? point_add_child(parent_id, mPointSignature)
            : part_add_child(parent_id);
          const reorder_before = next_content_id(id);
          if (reorder_before === undefined) return;
          reorder_child(parent_id, child.id, reorder_before);
          return child;
        },
      );
    },
  );
};
export const append_point_to_parent = (parent_id: switch_for_append_id): mPoint | undefined => {
  return switch_for_append(
    parent_id,
    (id) => part_add_child(id),
    (id) => {
      const parent_id = get_parent_id(id);
      if (parent_id === undefined || parent_id === null) return;
      return append_point_to_parent(parent_id);
    },
    (id) => {
      const parent_id = get_parent_id(id);
      if (parent_id === undefined || parent_id === null) return;
      if (id_is_mPart(parent_id)) return append_sibling_point(id);
      return append_sibling_point(parent_id);
    },
  );
};
export const append_point_to_part = (parent_id: switch_for_append_id): mPoint | undefined => {
  const _parent_id = get_ancestor_part(parent_id);
  let child: mPoint | undefined = undefined;
  if (_parent_id && id_is_mPart(_parent_id)) child = part_add_child(_parent_id);
  return child;
};
export const append_point_child = (parent_id: switch_for_append_id): mPoint | undefined => {
  return switch_for_append(
    parent_id,
    (id) => part_add_child(id),
    (id) => {
      const parent_id = get_parent_id(id);
      if (parent_id === undefined || parent_id === null) return;
      const child = append_point_child(parent_id);
      if (child === undefined) return;
      const reorder_before = next_content_id(id);
      if (reorder_before === undefined) return;
      reorder_child(parent_id, child.id, reorder_before);
      return child;
    },
    (id) => point_add_child(id, mPointSignature),
  );
};

export const set_rebut = (end1: mPoint['id'], end2: mPoint['id'] | undefined) => {
  let from: mPoint['id'], to: mPoint['id'] | undefined;
  if (end2 == undefined) {
    [from, to] = [end1, end2];
  } else {
    [to, from] = [end1, end2].sort((end1, end2) => {
      const part1 = get_ancestor_part(end1);
      if (part1 === undefined) throw TypeError('argument `end1` is not descendent of mPart');
      const part2 = get_ancestor_part(end2);
      if (part2 === undefined) throw TypeError('argument `end2` is not descendent of mPart');
      return compare_id(part1, part2);
    });
  }
  const obj = get_from_id(from);
  if (!is_mPoint(obj)) throw TypeError('param `from` does not match mPoint');
  store.dispatch(
    point_slice.actions.upsertOne({
      ...obj,
      rebut_to: to,
    }),
  );
};
export const set_rebut_to = (from: PointChild['id']) => (rebut_to: PointChild['id']) => {
  const point_rebut_to = get_ancestor_point(rebut_to);
  const point_from = get_ancestor_point(from);
  if (point_rebut_to && point_from) set_rebut(point_rebut_to, point_from);
};

export const add_rebut = (rebut_to: mPoint['id'], part: mPart['id']) => {
  const part_rebut_to = get_ancestor_part(rebut_to);
  if (part_rebut_to === undefined) throw TypeError('argument `rebut_to` is not descendent of mPart');
  if (compare_id(part_rebut_to, part) >= 0) throw new ValidationError('cannot rebut to point in later parts');
  const rebut_obj = part_add_child(part);
  set_rebut(rebut_to, rebut_obj.id);
  return rebut_obj;
};
export const add_rebut_to = (part: mPart['id']) => (rebut_to: mPoint['id']) => add_rebut(rebut_to, part);
