import {isObject} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mPartSignature='mPart';

export const part_id_prefix = 'part_';
export type mPartId = `${typeof part_id_prefix}${number}`;

export interface mPart extends baseModel {
  type_signature: typeof mPartSignature;
  id: mPartId;
  parent: baseModel['id'];
  name?: string|number;
  contents?: Array<baseModel['id']>; // mPointのID
}

export const is_mPart=(value: unknown): value is mPart =>{
  return isObject<mPart>(value) && value.type_signature==mPartSignature;
};
