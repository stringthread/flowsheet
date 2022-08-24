import {store} from 'stores';
import {claim_slice} from 'stores/slices/claim';
import {generate_claim_id} from 'stores/ids/id_generators';
import {baseModel} from 'models/baseModel';
import {mClaim, mClaimSignature} from 'models/mClaim';
import { get_from_id, get_parent_id } from './id';
import { is_mPoint } from 'models/mPoint';
import { point_slice } from 'stores/slices/point';
import { part_add_child } from './part';
import { switch_for_append, point_add_child } from './point';

export const generate_claim=(
  parent: baseModel['id'],
  from?: Omit<mClaim,'id'>
):mClaim=>{
  const parent_obj=get_from_id(parent);
  if(!is_mPoint(parent_obj)) throw TypeError('argument `parent` does not match mPoint');
  const generated: mClaim= {
    ...from,
    type_signature: mClaimSignature,
    id: generate_claim_id(),
    parent,
  };
  store.dispatch(claim_slice.actions.add(generated));
  store.dispatch(point_slice.actions.addChild([parent, generated.id]));
  return generated;
};

export const append_claim=(parent_id: baseModel['id']): mClaim|undefined=>{
  return switch_for_append(
    parent_id,
    (id)=>append_claim(part_add_child(id).id),
    (id)=>{
      const parent_id=get_parent_id(id);
      if(parent_id!==undefined&&parent_id!==null) return append_claim(parent_id);
    },
    (id)=>point_add_child(id,mClaimSignature)
  );
};