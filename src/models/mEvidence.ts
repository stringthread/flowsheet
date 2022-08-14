import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {baseModel, ID_TYPE, is_ID_TYPE, to_ID_TYPE} from './baseModel';
import { mPoint } from './mPoint';

export const mEvidenceSignature='mEvidence';

export const evidence_id_prefix='evi_';
declare const mEvidenceIdSymbol: unique symbol;
export type mEvidenceId = ID_TYPE&{[mEvidenceIdSymbol]: never};
export const is_mEvidenceId=(id:string): id is mEvidenceId => is_ID_TYPE(id) && id.startsWith(evidence_id_prefix);
export const to_mEvidenceId=(seed:string) => to_ID_TYPE(evidence_id_prefix + seed) as mEvidenceId;

export interface mEvidence extends baseModel {
  type_signature: typeof mEvidenceSignature;
  id: mEvidenceId;
  parent: mPoint['id'];
  about_author?: string;
  author?: string;
  year?: number|string;
  contents?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) && value.type_signature==mEvidenceSignature;
}