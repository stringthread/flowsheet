import {isObject} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';
import {mSide} from './mSide';
import {mPart} from './mPart';

export const mMatchSignature='mMatch';

export const match_id_prefix = 'match_';
export type mMatchId = `${typeof match_id_prefix}${number}`;
export const id_is_mMatch=(id: unknown): id is mMatchId=>{
  return typeof id ==='string' && id.startsWith(match_id_prefix);
};

export interface mMatch extends baseModel {
  type_signature: typeof mMatchSignature;
  id: mMatchId;
  topic?: string;
  date?: Date|string;
  side?: mSide['side'];
  winner?: string;
  opponent?: string;
  member?: Record<Required<mPart>['name'],string>; // パート名からメンバ名への対応
  note?: string;
  contents?: Array<mSide['id']>; // mSideのID
}

export const is_mMatch=(value: unknown): value is mMatch =>{
  return isObject<mMatch>(value) && value.type_signature==mMatchSignature;
};
