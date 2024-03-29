import { get_from_id, get_parent_id } from './id';
import { part_add_child } from './part';
import { switch_for_append, point_add_child, switch_for_append_id } from './point';
import { baseModel } from 'models/baseModel';
import { mClaim, mClaimSignature } from 'models/mClaim';
import { is_mPoint, mPoint } from 'models/mPoint';
import { store } from 'stores';
import { generate_claim_id } from 'stores/ids/id_generators';
import { claim_slice } from 'stores/slices/claim';
import { point_slice } from 'stores/slices/point';

export const generate_claim = (parent: mClaim['parent'], from?: Partial<Omit<mClaim, 'id'>>): mClaim => {
  const parent_obj = get_from_id(parent);
  if (!is_mPoint(parent_obj)) throw TypeError('argument `parent` does not match mPoint');
  const generated: mClaim = {
    ...from,
    type_signature: mClaimSignature,
    id: generate_claim_id(),
    parent,
  };
  store.dispatch(claim_slice.actions.add(generated));
  store.dispatch(point_slice.actions.addChild([parent, generated.id]));
  return generated;
};

export const append_claim = (parent_id: switch_for_append_id): mClaim | undefined => {
  return switch_for_append(
    parent_id,
    (id) => append_claim(part_add_child(id).id),
    (id) => {
      const parent_id = get_parent_id(id);
      if (parent_id !== undefined && parent_id !== null) return append_claim(parent_id);
    },
    (id) => point_add_child(id, mClaimSignature),
  );
};
