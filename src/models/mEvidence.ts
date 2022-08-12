import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mEvidenceSignature='mEvidence';

export interface mEvidence extends baseModel {
  type_signature: typeof mEvidenceSignature;
  parent: baseModel['id'];
  about_author?: string;
  author?: string;
  year?: number|string;
  contents?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) && value.type_signature==mEvidenceSignature;
}