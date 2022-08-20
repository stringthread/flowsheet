import { mClaim, mClaimId, rawClaim } from "./mClaim";
import { mEvidence, mEvidenceId, rawEvidence } from "./mEvidence";
import { mMatch, mMatchId, rawMatch } from "./mMatch";
import { mPart, mPartId, rawPart } from "./mPart";
import { mPoint, mPointId, rawPoint } from "./mPoint";
import { mSide, mSideId, rawSide } from "./mSide";

export type ID_TYPE=mMatchId|mSideId|mPartId|mPointId|mClaimId|mEvidenceId;
export type MODEL_TYPE=mMatch|mSide|mPart|mPoint|mClaim|mEvidence;
export type RAW_TYPE = rawMatch|rawSide|rawPart|rawPoint|rawClaim|rawEvidence;