import {store} from '../index';
import {evidence_slice} from '../slices/evidence';
import {claim_slice} from '../slices/claim';
import {point_slice} from '../slices/point';
import {part_slice} from '../slices/part';
import {side_slice} from '../slices/side';
import {match_slice} from '../slices/match';
import { mClaimId, to_mClaimId } from 'models/mClaim';
import { mEvidenceId, to_mEvidenceId } from 'models/mEvidence';
import { mMatchId, to_mMatchId } from 'models/mMatch';
import { mPartId, to_mPartId } from 'models/mPart';
import { mPointId, to_mPointId } from 'models/mPoint';
import { mSideId, to_mSideId } from 'models/mSide';

export const generate_evidence_id=():mEvidenceId=>{
  const id_number=store.getState().evidence.last_id_number;
  store.dispatch(evidence_slice.actions.incrementID());
  return to_mEvidenceId(id_number.toString());
}

export const generate_claim_id=():mClaimId=>{
  const id_number=store.getState().claim.last_id_number;
  store.dispatch(claim_slice.actions.incrementID());
  return to_mClaimId(id_number.toString());
}

export const generate_point_id=():mPointId=>{
  const id_number=store.getState().point.last_id_number;
  store.dispatch(point_slice.actions.incrementID());
  return to_mPointId(id_number.toString());
}

export const generate_part_id=():mPartId=>{
  const id_number=store.getState().part.last_id_number;
  store.dispatch(part_slice.actions.incrementID());
  return to_mPartId(id_number.toString());
}

export const generate_side_id=():mSideId=>{
  const id_number=store.getState().side.last_id_number;
  store.dispatch(side_slice.actions.incrementID());
  return to_mSideId(id_number.toString());
}

export const generate_match_id=():mMatchId=>{
  const id_number=store.getState().match.last_id_number;
  store.dispatch(match_slice.actions.incrementID());
  return to_mMatchId(id_number.toString());
}
