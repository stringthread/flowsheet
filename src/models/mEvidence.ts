import { baseModel } from './baseModel';
import { mPoint } from './mPoint';
import { isObject, multipleTypeof } from 'util/typeGuardUtils';

export const mEvidenceSignature = 'mEvidence';

export const evidence_id_prefix = 'evi_';
export type mEvidenceId = `${typeof evidence_id_prefix}${number}`;
export const id_is_mEvidence = (id: unknown): id is mEvidenceId => {
  return typeof id === 'string' && id.startsWith(evidence_id_prefix);
};

export interface mEvidence extends baseModel {
  type_signature: typeof mEvidenceSignature;
  id: mEvidenceId;
  parent: mPoint['id'];
  about_author?: string;
  author?: string;
  year?: number | string;
  contents?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) && value.type_signature == mEvidenceSignature;
};
