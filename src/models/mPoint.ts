import {baseModel} from './baseModel';
import {mEvidence} from './mEvidence';
import {mClaim} from './mClaim';
import {isObject} from 'util/typeGuardUtils';

export type PointChild = mClaim|mEvidence|mPoint;

export const mPointSignature='mPoint';

export const point_id_prefix = 'point_';
export type mPointId = `${typeof point_id_prefix}${number}`;

export interface mPoint extends baseModel {
  type_signature: typeof mPointSignature;
  id: mPointId;
  parent: baseModel['id'];
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<baseModel['id']>;
  rebut_to?: mPoint['id'];
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) && value.type_signature==mPointSignature;
}
