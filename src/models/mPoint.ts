import {mEvidence} from './mEvidence'
import {isObject, multipleTypeof} from '~/util/typeGuardUtils'

export type Claim = string;

export type PointChild = Claim|mEvidence|mPoint;

export interface mPoint {
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<PointChild>;
  _shorthands?: Map<string,number>; // _contentsのキーに変換
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) &&
    multipleTypeof(value.numbering, ['undefined','number','string']) &&
    multipleTypeof(value.children_numbering, ['undefined','number','string']) &&
    ((value?.contents instanceof Array)??true) &&
    ((value?._shorthands instanceof Map)??true);
}
