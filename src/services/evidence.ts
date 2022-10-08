import { get_from_id, get_parent_id } from './id';
import { part_add_child } from './part';
import { switch_for_append, point_add_child, switch_for_append_id } from './point';
import { baseModel } from 'models/baseModel';
import { mEvidence, mEvidenceSignature } from 'models/mEvidence';
import { is_mPoint } from 'models/mPoint';
import { store } from 'stores';
import { generate_evidence_id } from 'stores/ids/id_generators';
import { evidence_slice } from 'stores/slices/evidence';
import { point_slice } from 'stores/slices/point';

export const generate_evidence = (
  parent: mEvidence['parent'],
  from?: Partial<Omit<mEvidence, 'id' | 'content'>>,
): mEvidence => {
  const parent_obj = get_from_id(parent);
  if (!is_mPoint(parent_obj)) throw TypeError('argument `parent` does not match mPoint');
  const generated: mEvidence = {
    ...from,
    type_signature: mEvidenceSignature,
    id: generate_evidence_id(),
    parent,
  };
  store.dispatch(evidence_slice.actions.add(generated));
  store.dispatch(point_slice.actions.addChild([parent, generated.id]));
  return generated;
};

export const append_evidence = (parent_id: switch_for_append_id): mEvidence | undefined => {
  return switch_for_append(
    parent_id,
    (id) => append_evidence(part_add_child(id).id),
    (id) => {
      const parent_id = get_parent_id(id);
      if (parent_id !== undefined && parent_id !== null) return append_evidence(parent_id);
    },
    (id) => point_add_child(id, mEvidenceSignature),
  );
};
