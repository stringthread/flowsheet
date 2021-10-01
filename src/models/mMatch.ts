import {mSide} from './mSide';

export interface mMatch {
  topic?: string;
  date?: Date|string;
  side?: string;
  winner?: string;
  opponent?: string;
  member?: Map<string,string>; // パート名からメンバ名への対応
  note?: string;
  contents?: Array<mSide>;
}
