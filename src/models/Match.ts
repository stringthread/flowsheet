import {Part} from './Part';

export interface Match {
  topic?: string;
  date?: Date|string;
  side?: string;
  winner?: string;
  opponent?: string;
  member?: Map<string,string>; // パート名からメンバ名への対応
  note?: string;
  content?: Array<Part>;
}
