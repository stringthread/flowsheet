import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {baseModel, ID_TYPE} from './baseModel';
import { mPoint } from './mPoint';

export const mClaimSignature='mClaim';

declare const mClaimIdSymbol: unique symbol;
export type mClaimId = ID_TYPE&{[mClaimIdSymbol]: never};

export interface mClaim extends baseModel {
  type_signature: typeof mClaimSignature;
  id: mClaimId;
  parent: mPoint['id'];
  contents?: string;
}

export const is_mClaim = (value: unknown): value is mClaim => {
  return isObject<mClaim>(value) && value.type_signature==mClaimSignature;
}
