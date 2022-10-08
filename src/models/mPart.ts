import { baseModel } from './baseModel';
import { mPoint } from './mPoint';
import { mSide } from './mSide';
import { isObject } from 'util/typeGuardUtils';

export const mPartSignature = 'mPart';

export const part_id_prefix = 'part_';
export type mPartId = `${typeof part_id_prefix}${number}`;
export const id_is_mPart = (id: unknown): id is mPartId => {
  return typeof id === 'string' && id.startsWith(part_id_prefix);
};

export interface mPart extends baseModel {
  type_signature: typeof mPartSignature;
  id: mPartId;
  parent: mSide['id'];
  name?: string | number;
  contents?: Array<mPoint['id']>;
}

export const is_mPart = (value: unknown): value is mPart => {
  return isObject<mPart>(value) && value.type_signature == mPartSignature;
};
