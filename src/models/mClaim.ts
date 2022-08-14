import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {baseModel, ID_TYPE, is_ID_TYPE, to_ID_TYPE} from './baseModel';
import { mPoint } from './mPoint';

export const mClaimSignature='mClaim';

export const claim_id_prefix='claim_';
declare const mClaimIdSymbol: unique symbol;
export type mClaimId = ID_TYPE&{[mClaimIdSymbol]: never};
export const is_mClaimId=(id:string): id is mClaimId => is_ID_TYPE(id) && id.startsWith(claim_id_prefix);
export const to_mClaimId=(seed:string) => to_ID_TYPE(claim_id_prefix + seed) as mClaimId;

export interface mClaim extends baseModel {
  type_signature: typeof mClaimSignature;
  id: mClaimId;
  parent: mPoint['id'];
  contents?: string;
}

export const is_mClaim = (value: unknown): value is mClaim => {
  return isObject<mClaim>(value) && value.type_signature==mClaimSignature;
}
