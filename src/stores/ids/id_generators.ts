import { store } from '../index';
import { claim_slice } from '../slices/claim';
import { evidence_slice } from '../slices/evidence';
import { match_slice } from '../slices/match';
import { part_slice } from '../slices/part';
import { point_slice } from '../slices/point';
import { side_slice } from '../slices/side';
import { claim_id_prefix, mClaimId } from 'models/mClaim';
import { evidence_id_prefix, mEvidenceId } from 'models/mEvidence';
import { match_id_prefix, mMatchId } from 'models/mMatch';
import { mPartId, part_id_prefix } from 'models/mPart';
import { mPointId, point_id_prefix } from 'models/mPoint';
import { mSideId, side_id_prefix } from 'models/mSide';

export const generate_evidence_id = (): mEvidenceId => {
  const id_number = store.getState().evidence.last_id_number;
  store.dispatch(evidence_slice.actions.incrementID());
  return `${evidence_id_prefix}${id_number}`;
};

export const generate_claim_id = (): mClaimId => {
  const id_number = store.getState().claim.last_id_number;
  store.dispatch(claim_slice.actions.incrementID());
  return `${claim_id_prefix}${id_number}`;
};

export const generate_point_id = (): mPointId => {
  const id_number = store.getState().point.last_id_number;
  store.dispatch(point_slice.actions.incrementID());
  return `${point_id_prefix}${id_number}`;
};

export const generate_part_id = (): mPartId => {
  const id_number = store.getState().part.last_id_number;
  store.dispatch(part_slice.actions.incrementID());
  return `${part_id_prefix}${id_number}`;
};

export const generate_side_id = (): mSideId => {
  const id_number = store.getState().side.last_id_number;
  store.dispatch(side_slice.actions.incrementID());
  return `${side_id_prefix}${id_number}`;
};

export const generate_match_id = (): mMatchId => {
  const id_number = store.getState().match.last_id_number;
  store.dispatch(match_slice.actions.incrementID());
  return `${match_id_prefix}${id_number}`;
};
