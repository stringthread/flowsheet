import {isObject} from 'util/typeGuardUtils';
import {store} from 'stores';
import {side_slice} from 'stores/slices/side';
import {generate_side_id} from 'stores/slices/id_generators';
import {baseModel} from './baseModel';
import {mPart,generate_part} from './mPart';

const mSideSymbol=Symbol('mSide');

export interface mSide extends baseModel {
  typesigniture: typeof mSideSymbol,
  side?: string; // TODO: enumにする
  parent: baseModel['id'];
  contents?: Array<string>; // mPartのID
}

export const is_mSide=(value: unknown): value is mSide =>{
  return isObject<mSide>(value) && value.typesigniture==mSideSymbol;
};

export const generate_side=(
  parent: baseModel['id'],
  parts?:Array<mPart['name']>,
  from?:Omit<mSide,'typesigniture'|'id'|'parent'|'contents'>
):mSide=>{
  const generated: mSide= {
    ...from,
    typesigniture: mSideSymbol,
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
