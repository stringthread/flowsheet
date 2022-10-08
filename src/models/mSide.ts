import { baseModel } from './baseModel';
import { mMatch } from './mMatch';
import { mPart } from './mPart';
import { isObject } from 'util/typeGuardUtils';

export const mSideSignature = 'mSide';

export const side_id_prefix = 'side_';
export type mSideId = `${typeof side_id_prefix}${number}`;
export const id_is_mSide = (id: unknown): id is mSideId => {
  return typeof id === 'string' && id.startsWith(side_id_prefix);
};

export interface mSide extends baseModel {
  type_signature: typeof mSideSignature;
  id: mSideId;
  side?: string; // TODO: enumにする
  parent: mMatch['id'];
  contents?: Array<mPart['id']>; // mPartのID
}

export const is_mSide = (value: unknown): value is mSide => {
  return isObject<mSide>(value) && value.type_signature == mSideSignature;
};
