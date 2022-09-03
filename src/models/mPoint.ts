import {baseModel} from './baseModel';
import {id_is_mEvidence, mEvidence} from './mEvidence';
import {id_is_mClaim, mClaim} from './mClaim';
import {isObject} from 'util/typeGuardUtils';
import { id_is_mPart, mPart } from './mPart';

export const mPointSignature='mPoint';

export const point_id_prefix = 'point_';
export type mPointId = `${typeof point_id_prefix}${number}`;
export const id_is_mPoint=(id: unknown): id is mPointId=>{
  return typeof id ==='string' && id.startsWith(point_id_prefix);
};

export type PointChild = mClaim|mEvidence|mPoint;
export const id_is_PointChild = (id: unknown): id is PointChild['id'] => {
  return id_is_mPoint(id) || id_is_mClaim(id) || id_is_mEvidence(id);
};
export type PointParent = mPart|mPoint;
export const id_is_PointParent = (id: unknown): id is PointParent['id'] => {
  return id_is_mPart(id) || id_is_mPoint(id);
};

export interface mPoint extends baseModel {
  type_signature: typeof mPointSignature;
  id: mPointId;
  parent: PointParent['id'];
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<PointChild['id']>;
  rebut_to?: mPoint['id'];
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) && value.type_signature==mPointSignature;
}
