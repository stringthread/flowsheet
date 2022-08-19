import { is_mMatchId, mMatchId, mMatch, match_id_prefix, rawMatch } from 'models/mMatch';
import { is_mSideId, mSideId, mSide, side_id_prefix, rawSide } from 'models/mSide';
import { is_mPartId, mPartId, mPart, part_id_prefix, rawPart } from 'models/mPart';
import { is_mPointId, mPointId, mPoint, PointChildId, point_id_prefix, rawPoint } from 'models/mPoint';
import { is_mClaimId, mClaimId, mClaim, claim_id_prefix, rawClaim } from 'models/mClaim';
import { is_mEvidenceId, mEvidenceId, mEvidence, evidence_id_prefix, rawEvidence } from 'models/mEvidence';
import { store } from 'stores';
import { match_slice } from 'stores/slices/match';
import { side_slice } from 'stores/slices/side';
import { part_slice } from 'stores/slices/part';
import { point_slice } from 'stores/slices/point';
import { claim_slice } from 'stores/slices/claim';
import { evidence_slice } from 'stores/slices/evidence';
import { MODEL_TYPE } from 'models';

type ID_TYPE = mMatchId|mSideId|mPartId|mPointId|mClaimId|mEvidenceId;
type RAW_TYPE = rawMatch|rawSide|rawPart|rawPoint|rawClaim|rawEvidence;

type return_type_switch_by_case<T extends ID_TYPE,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>=
T extends mMatchId ? R_MATCH :
T extends mSideId ? R_SIDE :
T extends mPartId ? R_PART :
T extends mPointId ? R_POINT:
T extends mClaimId ? R_CLAIM :
T extends mEvidenceId ? R_EVIDENCE : R_OTHER;
export const switch_by_type = <R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER=never>(
  onMatch: ((id: mMatchId, ...args: any[])=>R_MATCH),
  onSide: ((id: mSideId, ...args: any[])=>R_SIDE),
  onPart: ((id: mPartId, ...args: any[])=>R_PART),
  onPoint: ((id: mPointId, ...args: any[])=>R_POINT),
  OnClaim: ((id: mClaimId, ...args: any[])=>R_CLAIM),
  onEvidence: ((id: mEvidenceId, ...args: any[])=>R_EVIDENCE),
  onOther: ((id: any, ...args: any[])=>R_OTHER),
)=>(
  <T extends ID_TYPE>(id:T, ...args:any[]):return_type_switch_by_case<T,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>=>{
    if(is_mMatchId(id)) return onMatch(id, ...args) as return_type_switch_by_case<T,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>;
    if(is_mSideId(id)) return onSide(id, ...args) as return_type_switch_by_case<T,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>;
    if(is_mPartId(id)) return onPart(id, ...args) as return_type_switch_by_case<T,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>;
    if(is_mPointId(id)) return onPoint(id, ...args) as return_type_switch_by_case<T,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>;
    if(is_mClaimId(id)) return OnClaim(id, ...args) as return_type_switch_by_case<T,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>;
    if(is_mEvidenceId(id)) return onEvidence(id, ...args) as return_type_switch_by_case<T,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>;
    return onOther(id) as return_type_switch_by_case<T,R_MATCH,R_SIDE,R_PART,R_POINT,R_CLAIM,R_EVIDENCE,R_OTHER>;
  }
);

export const id_to_type = switch_by_type<
  typeof match_id_prefix,
  typeof side_id_prefix,
  typeof part_id_prefix,
  typeof point_id_prefix,
  typeof claim_id_prefix,
  typeof evidence_id_prefix
>(
  _=>match_id_prefix,
  _=>side_id_prefix,
  _=>part_id_prefix,
  _=>point_id_prefix,
  _=>claim_id_prefix,
  _=>evidence_id_prefix,
  _=>{throw TypeError('broken formed id given to id_to_type')}
);
export const id_to_store = switch_by_type(
  _=>(()=>store.getState().match),
  _=>(()=>store.getState().side),
  _=>(()=>store.getState().part),
  _=>(()=>store.getState().point),
  _=>(()=>store.getState().claim),
  _=>(()=>store.getState().evidence),
  _=>{throw TypeError('broken formed id given to id_to_store')}
);

export const id_to_slice=switch_by_type(
  _=>match_slice,
  _=>side_slice,
  _=>part_slice,
  _=>point_slice,
  _=>claim_slice,
  _=>evidence_slice,
  _=>{throw TypeError('broken formed id given to id_to_slice')}
);

const raw_from_id = switch_by_type(
  id=>store.getState().match.entities[id.id],
  id=>store.getState().side.entities[id.id],
  id=>store.getState().part.entities[id.id],
  id=>store.getState().point.entities[id.id],
  id=>store.getState().claim.entities[id.id],
  id=>store.getState().evidence.entities[id.id],
  _=>{throw TypeError('broken formed id given to raw_from_id')}
);

const id_and_raw_to_model = switch_by_type(
  (_, raw: rawMatch)=>{return new mMatch(raw)},
  (_, raw: rawSide)=>{return new mSide(raw)},
  (_, raw: rawPart)=>{return new mPart(raw)},
  (_, raw: rawPoint)=>{return new mPoint(raw)},
  (_, raw: rawClaim)=>{return new mClaim(raw)},
  (_, raw: rawEvidence)=>{return new mEvidence(raw)},
  _=>{throw TypeError('broken formed id given to id_and_raw_to_model')}
);

export function get_from_id<T extends ID_TYPE>(id:T){
  const raw_obj = raw_from_id(id);
  if(raw_obj===undefined) return;
  return id_and_raw_to_model(id, raw_obj);
};
