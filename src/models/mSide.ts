import {mPart} from './mPart';

export interface mSide {
  side?: string; // TODO: enumにする
  content?: Array<mPart>;
}
