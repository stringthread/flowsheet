import { mClaim, mClaimId, mClaimSignature } from "./mClaim";
import { mEvidence, mEvidenceId, mEvidenceSignature } from "./mEvidence";
import { mMatch, mMatchId, mMatchSignature } from "./mMatch";
import { mPart, mPartId, mPartSignature } from "./mPart";
import { mPoint, mPointId, mPointSignature } from "./mPoint";
import { mSide, mSideId, mSideSignature } from "./mSide";

export type ID_TYPE=mMatchId|mSideId|mPartId|mPointId|mClaimId|mEvidenceId;
export type MODEL_TYPE=mMatch|mSide|mPart|mPoint|mClaim|mEvidence;
export type modelSignatures=typeof mMatchSignature|typeof mSideSignature|typeof mPartSignature|typeof mPointSignature|typeof mClaimSignature|typeof mEvidenceSignature;