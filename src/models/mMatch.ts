import {isObject} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';
import {mSide} from './mSide';
import {mPart} from './mPart';

export const mMatchSignature='mMatch';

export interface mMatch extends baseModel {
  type_signature: typeof mMatchSignature,
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
