import {isObject} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mSideSymbol='mSide';

export interface mSide extends baseModel {
  typesigniture: typeof mSideSymbol,
  side?: string; // TODO: enumにする
  parent: baseModel['id'];
  contents?: Array<baseModel['id']>; // mPartのID
}

export const is_mSide=(value: unknown): value is mSide =>{
  return isObject<mSide>(value) && value.typesigniture==mSideSymbol;
};
