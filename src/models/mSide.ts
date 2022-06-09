import {store} from 'stores';
import {side_slice} from 'stores/slices/side';
import {generate_side_id} from 'stores/slices/id_generators';
import {mMatch} from './mMatch';
import {mPart,generate_part} from './mPart';

export interface mSide {
  id: string;
  side?: string; // TODO: enumにする
  parent: mMatch['id'];
  contents?: Array<string>; // mPartのID
}

export const generate_side=(
  parent: mMatch['id'],
  parts?:Array<mPart['name']>,
  from?:Omit<mSide,'id'|'parent'|'contents'>
):mSide=>{
  const generated: mSide= {
    ...from,
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
