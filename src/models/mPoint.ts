import {baseModel, ID_TYPE} from './baseModel';
import {mEvidence} from './mEvidence';
import {mClaim} from './mClaim';
import {isObject} from 'util/typeGuardUtils';
import { mSide } from './mSide';

export type PointChild = mPoint|mEvidence|mPoint;

export const mPointSignature='mPoint';

declare const mPointIdSymbol: unique symbol;
export type mPointId = ID_TYPE&{[mPointIdSymbol]: never};

export interface mPoint extends baseModel {
  type_signature: typeof mPointSignature;
  id: mPointId;
  parent: mSide['id']|mPoint['id'];
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<baseModel['id']>;
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) && value.type_signature==mPointSignature;
}
