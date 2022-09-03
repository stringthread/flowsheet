import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mClaimSignature='mClaim';

export const claim_id_prefix = 'claim_';
export type mClaimId = `${typeof claim_id_prefix}${number}`;

export interface mClaim extends baseModel {
  type_signature: typeof mClaimSignature;
  id: mClaimId;
  parent: baseModel['id'];
  contents?: string;
}

export const is_mClaim = (value: unknown): value is mClaim => {
  return isObject<mClaim>(value) && value.type_signature==mClaimSignature;
}
