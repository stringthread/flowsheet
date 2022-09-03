import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mEvidenceSignature='mEvidence';

export const evidence_id_prefix = 'evi_';
export type mEvidenceId = `${typeof evidence_id_prefix}${number}`;

export interface mEvidence extends baseModel {
  type_signature: typeof mEvidenceSignature;
  id: mEvidenceId;
  parent: baseModel['id'];
  about_author?: string;
  author?: string;
  year?: number|string;
  contents?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) && value.type_signature==mEvidenceSignature;
}