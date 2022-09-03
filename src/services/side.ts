import {isObject} from 'util/typeGuardUtils';
import {store} from 'stores';
import {side_slice} from 'stores/slices/side';
import {generate_side_id} from 'stores/ids/id_generators';
import {baseModel} from 'models/baseModel';
import {mPart} from 'models/mPart';
import {mSide, mSideSignature} from 'models/mSide';
import {generate_part} from './part';
import { is_mMatch, mMatch } from 'models/mMatch';
import { get_from_id } from './id';
import { match_slice } from 'stores/slices/match';


export const generate_side=(
  parent: mMatch['id'],
  parts?:Array<mPart['name']>,
  from?:Partial<Omit<mSide,'type_signature'|'id'|'parent'|'contents'>>
):mSide=>{
  const parent_obj=get_from_id(parent);
  if(!is_mMatch(parent_obj)) throw TypeError('argument `parent` does not match mMatch');
  const generated: mSide= {
    ...from,
    type_signature: mSideSignature,
    id: generate_side_id(),
    parent,
  };
  store.dispatch(side_slice.actions.add(generated));
  const contents: mSide['contents'] =[];
  if(parts!==undefined){
    for(const e of parts){
      contents.push(generate_part(generated.id,{name:e}).id); // TODO: reduxに保存する処理を追加
    }
  }
  const returned={...generated, contents};
  store.dispatch(side_slice.actions.upsertOne(returned));
  store.dispatch(match_slice.actions.addChild([parent,generated.id]));
  return returned;
}
