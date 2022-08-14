import {isObject} from 'util/typeGuardUtils';
import {baseModel, ID_TYPE} from './baseModel';
import { mMatch } from './mMatch';
import { mPart } from './mPart';

export const mSideSignature='mSide';

declare const mSideIdSymbol: unique symbol;
export type mSideId = ID_TYPE&{[mSideIdSymbol]: never};

export interface mSide extends baseModel {
  type_signature: typeof mSideSignature;
  id: mSideId;
  side?: string; // TODO: enumにする
  parent: mMatch['id'];
  contents?: Array<mPart['id']>; // mPartのID
}

export const is_mSide=(value: unknown): value is mSide =>{
  return isObject<mSide>(value) && value.type_signature==mSideSignature;
};
