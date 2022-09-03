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
import { mPoint } from 'models/mPoint';

export const generate_part=(
  parent: mPart['parent'],
  from?: Partial<Omit<mPart,'type_signature'|'id'|'parent'>>,
  empty: boolean = false,
):mPart=>{
  const parent_obj=get_from_id(parent);
  if(!is_mSide(parent_obj)) throw TypeError('argument `parent` does not match mSide');
  if(from!==undefined && 'contents' in from) empty = true;
  const generated: mPart= {
    ...from,
    type_signature: mPartSignature,
    id: generate_part_id(),
    parent,
  };
  store.dispatch(part_slice.actions.add(generated));
  const child_point=empty?undefined:generate_point(generated.id); // NOTE: 仮実装
  store.dispatch(side_slice.actions.addChild([parent, generated.id]));
  return (get_from_id(generated.id) as mPart|undefined)??generated;
}

export const part_add_child=(parent_id:mPart['id'])=>{
  const child=generate_point(parent_id);
  store.dispatch(point_slice.actions.add(child));
  return child;
}

export const part_set_child = (parent_id: mPart['id'], child_id: mPoint['id']): void => {
  store.dispatch(part_slice.actions.addChild([parent_id, child_id]));
}