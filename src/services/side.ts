import {isObject} from 'util/typeGuardUtils';
import {store} from 'stores';
import {side_slice} from 'stores/slices/side';
import {generate_side_id} from 'stores/ids/id_generators';
import {baseModel} from 'models/baseModel';
import {mPart} from 'models/mPart';
import {mSide, mSideSignature} from 'models/mSide';
import {generate_part} from './part';


export const generate_side=(
  parent: baseModel['id'],
  parts?:Array<mPart['name']>,
  from?:Omit<mSide,'type_signature'|'id'|'parent'|'contents'>
):mSide=>{
  const generated: mSide= {
    ...from,
    type_signature: mSideSignature,
    id: generate_side_id(),
    parent,
  };
  const contents: mSide['contents'] =[];
  if(parts!==undefined){
    for(const e of parts){
      contents.push(generate_part(generated.id,{name:e}).id); // TODO: reduxに保存する処理を追加
    }
  }
  generated.contents=contents;
  store.dispatch(side_slice.actions.add(generated));
  return generated;
}
