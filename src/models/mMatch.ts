import {isObject} from 'util/typeGuardUtils';
import {baseModel, ID_TYPE, is_ID_TYPE, to_ID_TYPE} from './baseModel';
import {mSide} from './mSide';
import {mPart} from './mPart';

export const mMatchSignature='mMatch';

export const match_id_prefix='match_';
declare const mMatchIdSymbol: unique symbol;
export type mMatchId = ID_TYPE&{[mMatchIdSymbol]: never};
export const is_mMatchId=(id:string): id is mMatchId => is_ID_TYPE(id) && id.startsWith(match_id_prefix);
export const to_mMatchId=(seed:string) => to_ID_TYPE(match_id_prefix + seed) as mMatchId;

export interface mMatch extends baseModel {
  type_signature: typeof mMatchSignature;
  id: mMatchId;
  topic?: string;
  date?: Date|string;
  side?: mSide['side'];
  winner?: string;
  opponent?: string;
  member?: Map<mPart['name'],string>; // パート名からメンバ名への対応
  note?: string;
  contents?: Array<baseModel['id']>; // mSideのID
}

export const is_mMatch=(value: unknown): value is mMatch =>{
  return isObject<mMatch>(value) && value.type_signature==mMatchSignature;
};
