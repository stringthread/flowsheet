import {isObject} from 'util/typeGuardUtils';
import {baseModel, BASE_ID_TYPE, is_ID_TYPE, to_ID_TYPE} from './baseModel';
import { mMatch } from './mMatch';
import { mPart, mPartId } from './mPart';

export const mSideSignature='mSide';

export const side_id_prefix='side_';
declare const mSideIdSymbol: unique symbol;
export type mSideId = BASE_ID_TYPE&{[mSideIdSymbol]: never};
export const is_mSideId=(id:string): id is mSideId => is_ID_TYPE(id) && id.startsWith(side_id_prefix);
export const to_mSideId=(seed:string) => to_ID_TYPE(side_id_prefix + seed) as mSideId;

export interface mSide extends baseModel {
  type_signature: typeof mSideSignature;
  id: mSideId;
  side?: string; // TODO: enumにする
  parent: mMatch['id'];
  contents?: Array<mPartId>;
}

export const is_mSide=(value: unknown): value is mSide =>{
  return isObject<mSide>(value) && value.type_signature==mSideSignature;
};
