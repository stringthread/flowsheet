import {isObject} from 'util/typeGuardUtils';
import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {generate_part_id} from 'stores/ids/id_generators';
import {baseModel} from './baseModel';
import {generate_point} from 'models/mPoint';

export const mPartSymbol=Symbol('mPart');

export interface mPart extends baseModel {
  typesigniture: typeof mPartSymbol,
  parent: baseModel['id'];
  name?: string|number;
  contents?: Array<baseModel['id']>; // mPointのID
}

export const is_mPart=(value: unknown): value is mPart =>{
  return isObject<mPart>(value) && value.typesigniture==mPartSymbol;
};

export const generate_part=(
  parent: baseModel['id'],
  from?:Omit<mPart,'typesigniture'|'id'|'parent'|'contents'>,
):mPart=>{
  const generated: mPart= {
    ...from,
    typesigniture: mPartSymbol,
    id: generate_part_id(),
    parent,
  };
  const child_point=generate_point(generated.id); // NOTE: 仮実装
  generated.contents=[child_point.id], // NOTE: 仮実装
  store.dispatch(part_slice.actions.add(generated));
  return generated;
}

export const part_add_child=(parent_id:mPart['id'])=>{
  const child=generate_point(parent_id);
  store.dispatch(point_slice.actions.add(child));
  store.dispatch(part_slice.actions.addChild([parent_id,child.id]));
  return child;
}
