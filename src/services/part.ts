import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {generate_part_id} from 'stores/ids/id_generators';
import {baseModel} from 'models/baseModel';
import {mPart, mPartSymbol} from 'models/mPart';
import {generate_point} from 'services/point';

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
