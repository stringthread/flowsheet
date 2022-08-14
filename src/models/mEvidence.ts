import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {baseModel, ID_TYPE} from './baseModel';
import { mPoint } from './mPoint';

export const mEvidenceSignature='mEvidence';

declare const mEvidenceIdSymbol: unique symbol;
export type mEvidenceId = ID_TYPE&{[mEvidenceIdSymbol]: never};

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