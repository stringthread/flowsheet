import {store} from 'stores';
import {match_slice} from 'stores/slices/match';
import {generate_match_id} from 'stores/ids/id_generators';
import {mPart} from 'models/mPart';
import {mSide, mSideId} from 'models/mSide';
import {mMatch, mMatchSignature} from 'models/mMatch';
import {generate_side} from  './side';

export const generate_match=(
  sides?:Record<NonNullable<mSide['side']>,Array<mPart['name']>>,
  from?: Omit<mMatch,'id'|'contents'>
):mMatch=>{
  const generated: mMatch= {
    ...from,
    type_signature: mMatchSignature,
    id: generate_match_id(),
  };
  store.dispatch(match_slice.actions.add(generated));
  const contents: Array<mSideId>=[];
  if(sides!==undefined){
    for(const i in sides){
      contents.push(generate_side(generated.id,sides[i],{side:i}).id); // TODO: reduxに保存する処理を追加
    }
  }
  const returned={...generated, contents}
  store.dispatch(match_slice.actions.upsertOne(returned));
  return returned;
}
