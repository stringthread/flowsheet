import {store} from 'stores';
import {side_slice} from 'stores/slices/side';
import {generate_side_id} from 'stores/slices/id_generators';
import {mPart,generate_part} from './mPart';

export interface mSide {
  id: string;
  side?: string; // TODO: enumにする
  contents?: Array<string>; // mPartのID
}

export const generate_side=(
  parts?:Array<mPart['name']>,
  from?:Omit<mSide,'id'|'contents'>
):mSide=>{
  const contents: mSide['contents'] =[];
  if(parts!==undefined){
    for(const e of parts){
      contents.push(generate_part({name:e}).id); // TODO: reduxに保存する処理を追加
    }
  }
  const generated: mSide= {
    ...from,
    id: generate_side_id(),
    contents,
  };
  store.dispatch(side_slice.actions.add(generated));
  return generated;
}
