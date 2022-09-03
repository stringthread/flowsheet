import {isObject} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mSideSignature='mSide';

export const side_id_prefix = 'side_';
export type mSideId = `${typeof side_id_prefix}${number}`;

export interface mSide extends baseModel {
  type_signature: typeof mSideSignature;
  id: mSideId;
  side?: string; // TODO: enumにする
  parent: baseModel['id'];
  contents?: Array<baseModel['id']>; // mPartのID
}

export const is_mSide=(value: unknown): value is mSide =>{
  return isObject<mSide>(value) && value.type_signature==mSideSignature;
};
