import {store} from 'stores';
import {part_slice} from 'stores/slices/part';
import {generate_part_id} from 'stores/slices/id_generators';

export interface mPart {
  id: string;
  name?: string|number;
  contents?: Array<string>; // mPointのID
}

export const generate_part=(
  from?:Omit<mPart,'id'|'contents'>,
):mPart=>{
  const generated: mPart= {
    ...from,
    id: generate_part_id()
  };
  store.dispatch(part_slice.actions.add(generated));
  return generated;
}
