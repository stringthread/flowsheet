import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {point_slice} from 'stores/slices/point';
import {generate_part_id} from 'stores/slices/id_generators';
import {generate_point} from 'models/mPoint';

export interface mPart {
  id: string;
  name?: string|number;
  contents?: Array<string>; // mPointのID
}

export const generate_part=(
  from?:Omit<mPart,'id'|'contents'>,
):mPart=>{
  const child_point=generate_point();// NOTE: 仮実装
  const generated: mPart= {
    ...from,
    id: generate_part_id(),
    contents: [child_point.id], // NOTE: 仮実装
  };
  store.dispatch(part_slice.actions.add(generated));
  return generated;
}

export const part_add_child=(parent:mPart)=>{
  const child=generate_point();
  store.dispatch(point_slice.actions.add(child));
  store.dispatch(part_slice.actions.addChild([parent.id,child.id]));
  return store.getState().part.entities[parent.id]??null;
}
