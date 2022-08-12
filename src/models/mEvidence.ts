import {baseModel} from './baseModel';

export const mEvidenceSymbol=Symbol('mEvidence');

export interface mEvidence extends baseModel {
  typesigniture: typeof mEvidenceSymbol,
  parent: baseModel['id'];
  about_author?: string;
  author?: string;
  year?: number|string;
  contents?: string;
}
