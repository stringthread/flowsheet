import { mClaim, mClaimId } from "./mClaim";
import { mEvidence, mEvidenceId } from "./mEvidence";
import { mMatch, mMatchId } from "./mMatch";
import { mPart, mPartId } from "./mPart";
import { mPoint, mPointId } from "./mPoint";
import { mSide, mSideId } from "./mSide";

export type MODEL_TYPE = mMatch|mSide|mPart|mPoint|mClaim|mEvidence;
export type ID_TYPE = mMatchId|mSideId|mPartId|mPointId|mClaimId|mEvidenceId;