import {isObject} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';
import {mSide} from './mSide';
import {mPart} from './mPart';

export const mMatchSymbol=Symbol('mMatch');

export interface mMatch extends baseModel {
  typesigniture: typeof mMatchSymbol,
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
  return isObject<mMatch>(value) && value.typesigniture==mMatchSymbol;
};
