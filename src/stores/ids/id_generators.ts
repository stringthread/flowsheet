import {store} from '../index';
import {evidence_slice} from '../slices/evidence';
import {point_slice} from '../slices/point';
import {part_slice} from '../slices/part';
import {side_slice} from '../slices/side';
import {match_slice} from '../slices/match';

export const evidence_id_prefix='evi_';
export const point_id_prefix='point_';
export const part_id_prefix='part_';
export const side_id_prefix='side_';
export const match_id_prefix='match_';

export const generate_evidence_id=()=>{
  const id_number=store.getState().evidence.last_id_number;
  store.dispatch(evidence_slice.actions.incrementID());
  return evidence_id_prefix+id_number.toString();
}

export const generate_point_id=()=>{
  const id_number=store.getState().point.last_id_number;
  store.dispatch(point_slice.actions.incrementID());
  return point_id_prefix+id_number.toString();
}

export const generate_part_id=()=>{
  const id_number=store.getState().part.last_id_number;
  store.dispatch(part_slice.actions.incrementID());
  return part_id_prefix+id_number.toString();
}

export const generate_side_id=()=>{
  const id_number=store.getState().side.last_id_number;
  store.dispatch(side_slice.actions.incrementID());
  return side_id_prefix+id_number.toString();
}

export const generate_match_id=()=>{
  const id_number=store.getState().match.last_id_number;
  store.dispatch(match_slice.actions.incrementID());
  return match_id_prefix+id_number.toString();
}
