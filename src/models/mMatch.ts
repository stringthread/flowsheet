import {store} from 'stores';
import {match_slice} from 'stores/slices/match';
import {generate_match_id} from 'stores/slices/id_generators';
import {mSide,generate_side} from './mSide';
import {mPart} from './mPart';

export interface mMatch {
  id: string;
  topic?: string;
  date?: Date|string;
  side?: mSide['side'];
  winner?: string;
  opponent?: string;
  member?: Map<mPart['name'],string>; // パート名からメンバ名への対応
  note?: string;
  contents?: Array<string>; // mSideのID
}

export const generate_match=(
  sides?:Record<NonNullable<mSide['side']>,Array<mPart['name']>>,
  from?: Omit<mMatch,'id'|'contents'>
):mMatch=>{
  const generated: mMatch= {
    ...from,
    id: generate_match_id(),
  };
  const contents: Array<string>=[];
  if(sides!==undefined){
    for(const i in sides){
      contents.push(generate_side(generated.id,sides[i],{side:i}).id); // TODO: reduxに保存する処理を追加
    }
  }
  generated.contents=contents;
  store.dispatch(match_slice.actions.add(generated));
  return generated;
}
