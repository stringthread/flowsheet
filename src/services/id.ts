import { is_mMatchId, mMatchId, mMatch, match_id_prefix, rawMatch } from 'models/mMatch';
import { is_mSideId, mSideId, mSide, side_id_prefix, rawSide } from 'models/mSide';
import { is_mPartId, mPartId, mPart, part_id_prefix, rawPart } from 'models/mPart';
import { is_mPointId, mPointId, mPoint, PointChildId, point_id_prefix, rawPoint, PointParent, PointParentId } from 'models/mPoint';
import { is_mClaimId, mClaimId, mClaim, claim_id_prefix, rawClaim } from 'models/mClaim';
import { is_mEvidenceId, mEvidenceId, mEvidence, evidence_id_prefix, rawEvidence } from 'models/mEvidence';
import { store } from 'stores';
import { match_slice } from 'stores/slices/match';
import { side_slice } from 'stores/slices/side';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { claim_slice } from 'stores/slices/claim';
import { evidence_slice } from 'stores/slices/evidence';
import { MODEL_TYPE, ID_TYPE, RAW_TYPE } from 'models';
import { assertNever } from 'util/utilityTypes';

export function get_from_id(id:mMatchId): mMatch|undefined;
export function get_from_id(id:mSideId): mSide|undefined;
export function get_from_id(id:mPartId): mPart|undefined;
export function get_from_id(id:mPointId): mPoint|undefined;
export function get_from_id(id:PointParentId): PointParent|undefined;
export function get_from_id(id:mClaimId): mClaim|undefined;
export function get_from_id(id:mEvidenceId): mEvidence|undefined;
export function get_from_id(id:ID_TYPE): MODEL_TYPE|undefined;
export function get_from_id(id:ID_TYPE){
  if(is_mMatchId(id)) {
    const raw = store.getState().match.entities[id.id];
    if(raw===undefined) return;
    return new mMatch(raw);
  }
  if(is_mSideId(id)) {
    const raw = store.getState().side.entities[id.id];
    if(raw===undefined) return;
    return new mSide(raw);
  }
  if(is_mPartId(id)) {
    const raw = store.getState().part.entities[id.id];
    if(raw===undefined) return;
    return new mPart(raw);
  }
  if(is_mPointId(id)) {
    const raw = store.getState().point.entities[id.id];
    if(raw===undefined) return;
    return new mPoint(raw);
  }
  if(is_mClaimId(id)) {
    const raw = store.getState().claim.entities[id.id];
    if(raw===undefined) return;
    return new mClaim(raw);
  }
  if(is_mEvidenceId(id)) {
    const raw = store.getState().evidence.entities[id.id];
    if(raw===undefined) return;
    return new mEvidence(raw);
  }
  assertNever(id);
}