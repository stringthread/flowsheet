import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {generate_part_id} from 'stores/ids/id_generators';
import {baseModel} from 'models/baseModel';
import {mPart, mPartSignature} from 'models/mPart';
import {generate_point} from 'services/point';
import { get_from_id } from './id';
import { is_mSide } from 'models/mSide';
import { side_slice } from 'stores/slices/side';

export const generate_part=(
  parent: baseModel['id'],
  from?:Omit<mPart,'type_signature'|'id'|'parent'|'contents'>,
):mPart=>{
  const parent_obj=get_from_id(parent);
  if(!is_mSide(parent_obj)) throw TypeError('argument `parent` does not match mSide');
  const generated: mPart= {
    ...from,
    type_signature: mPartSignature,
    id: generate_part_id(),
    parent,
  };
  store.dispatch(part_slice.actions.add(generated));
  const child_point=generate_point(generated.id); // NOTE: 仮実装
  const contents=[child_point.id]; // NOTE: 仮実装
  const returned={...generated, contents};
  store.dispatch(part_slice.actions.upsertOne(returned));
  store.dispatch(side_slice.actions.addChild([parent, generated.id]));
  return returned;
}

export const part_add_child=(parent_id:mPart['id'])=>{
  const child=generate_point(parent_id);
  store.dispatch(point_slice.actions.add(child));
  return child;
}
