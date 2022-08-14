import {isObject} from 'util/typeGuardUtils';
import {baseModel, ID_TYPE, is_ID_TYPE, to_ID_TYPE} from './baseModel';
import { mSide } from './mSide';

export const mPartSignature='mPart';

export const part_id_prefix='part_';
declare const mPartIdSymbol: unique symbol;
export type mPartId = ID_TYPE&{[mPartIdSymbol]: never};
export const is_mPartId=(id:string): id is mPartId => is_ID_TYPE(id) && id.startsWith(part_id_prefix);
export const to_mPartId=(seed:string) => to_ID_TYPE(part_id_prefix + seed) as mPartId;

export interface mPart extends baseModel {
  type_signature: typeof mPartSignature;
  id: mPartId;
  parent: mSide['id'];
  name?: string|number;
  contents?: Array<baseModel['id']>; // mPointのID
}

export const is_mPart=(value: unknown): value is mPart =>{
  return isObject<mPart>(value) && value.type_signature==mPartSignature;
};
