import {baseModel, BASE_ID_TYPE, is_ID_TYPE, to_ID_TYPE} from './baseModel';
import {mEvidence, mEvidenceId} from './mEvidence';
import {mClaim, mClaimId} from './mClaim';
import {isObject} from 'util/typeGuardUtils';
import { mPart } from './mPart';

export const mPointSignature='mPoint';

export const point_id_prefix='point_';
declare const mPointIdSymbol: unique symbol;
export type mPointId = BASE_ID_TYPE&{[mPointIdSymbol]: never};
export const is_mPointId=(id:string): id is mPointId => is_ID_TYPE(id) && id.startsWith(point_id_prefix);
export const to_mPointId=(seed:string) => to_ID_TYPE(point_id_prefix + seed) as mPointId;

export type PointChild = mPoint|mEvidence|mClaim;
export type PointChildId = mPointId|mEvidenceId|mClaimId;

export interface mPoint extends baseModel {
  type_signature: typeof mPointSignature;
  id: mPointId;
  parent: mPart['id']|mPoint['id'];
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<PointChildId>;
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) && value.type_signature==mPointSignature;
}
