import {baseModel} from './baseModel';
import {mEvidence} from './mEvidence';
import {isObject} from 'util/typeGuardUtils';

export type Claim = string;

export const is_Claim=(value:unknown): value is Claim=>{
  return typeof value=='string';
}

export type PointChild = Claim|mEvidence|mPoint;

export const mPointSignature='mPoint';

export interface mPoint extends baseModel {
  type_signature: typeof mPointSignature,
  parent: baseModel['id'];
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<[baseModel['id'],boolean]>|Claim; // [PointChildのID,isPoint]かClaim単体
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) && value.type_signature==mPointSignature;
}
