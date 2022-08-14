import {isObject} from 'util/typeGuardUtils';
import {baseModel, ID_TYPE} from './baseModel';
import { mSide } from './mSide';

export const mPartSignature='mPart';

declare const mPartIdSymbol: unique symbol;
export type mPartId = ID_TYPE&{[mPartIdSymbol]: never};

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
