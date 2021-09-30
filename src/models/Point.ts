import {Evidence} from './Evidence.ts'

export type Claim = string;

export type PointChild = Claim|Evidence|Point;

export interface Point {
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<PointChild>;
  _shorthands?: Map<string,number>; // _contentsのキーに変換
}
