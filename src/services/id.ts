import {ID_TYPE, evidence_id_prefix, point_id_prefix, part_id_prefix, side_id_prefix, match_id_prefix} from '../stores/ids/id_generators'

export const id_is_mMatch=(id:ID_TYPE):boolean=>{
  return id.startsWith(match_id_prefix);
}
export const id_is_mSide=(id:ID_TYPE):boolean=>{
  return id.startsWith(side_id_prefix);
}
export const id_is_mPart=(id:ID_TYPE):boolean=>{
  return id.startsWith(part_id_prefix);
}
export const id_is_mPoint=(id:ID_TYPE):boolean=>{
  return id.startsWith(point_id_prefix);
}
export const id_is_mEvidence=(id:ID_TYPE):boolean=>{
  return id.startsWith(evidence_id_prefix);
}