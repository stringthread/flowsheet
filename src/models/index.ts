import { claim_id_prefix, mClaim, mClaimId } from './mClaim';
import { evidence_id_prefix, mEvidence, mEvidenceId } from './mEvidence';
import { match_id_prefix, mMatch, mMatchId } from './mMatch';
import { mPart, mPartId, part_id_prefix } from './mPart';
import { mPoint, mPointId, point_id_prefix } from './mPoint';
import { mSide, mSideId, side_id_prefix } from './mSide';

export type MODEL_TYPE = mMatch | mSide | mPart | mPoint | mClaim | mEvidence;
export type ID_TYPE = mMatchId | mSideId | mPartId | mPointId | mClaimId | mEvidenceId;
export type SIGNATURE_TYPE = MODEL_TYPE['type_signature'];
export type PREFIX_TYPE =
  | typeof match_id_prefix
  | typeof side_id_prefix
  | typeof part_id_prefix
  | typeof point_id_prefix
  | typeof claim_id_prefix
  | typeof evidence_id_prefix;
