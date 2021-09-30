import {mEvidence} from './mEvidence'

export type Claim = string;

export type PointChild = Claim|mEvidence|mPoint;

export interface mPoint {
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<PointChild>;
  _shorthands?: Map<string,number>; // _contentsのキーに変換
}
