import {isObject} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mSideSignature='mSide';

export interface mSide extends baseModel {
  type_signature: typeof mSideSignature;
  side?: string; // TODO: enumにする
  parent: baseModel['id'];
  contents?: Array<baseModel['id']>; // mPartのID
}

export const is_mSide=(value: unknown): value is mSide =>{
  return isObject<mSide>(value) && value.type_signature==mSideSignature;
};
