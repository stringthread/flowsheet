import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mEvidenceSymbol='mEvidence';

export interface mEvidence extends baseModel {
  typesigniture: typeof mEvidenceSymbol,
  parent: baseModel['id'];
  about_author?: string;
  author?: string;
  year?: number|string;
  contents?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) && value.typesigniture==mEvidenceSymbol;
}