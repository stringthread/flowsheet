import { id_is_mClaim, is_mClaim, mClaim } from "models/mClaim";
import { id_is_mEvidence, is_mEvidence, mEvidence } from "models/mEvidence";
import { mPart } from "models/mPart";
import { id_is_mPoint, is_mPoint, mPoint, PointChild } from "models/mPoint";
import { get_from_id } from "services/id";
import { generate_point, point_set_child } from "services/point";
import { isObject } from "util/typeGuardUtils";
import { ClaimInputObj, ClaimOutputObj, decodeClaim, encodeClaim } from "./claim";
import { decodeEvidence, encodeEvidence, EvidenceInputObj, EvidenceOutputObj } from "./evidence";
import { decodeResult, idMap } from "./loader";

export interface PointOutputObj {
  point: {
    '@id': mPoint['id'];
    '@numbering'?: mPoint['numbering'];
    '@rebut_to'?: mPoint['rebut_to'];
    '#'?: (PointOutputObj|EvidenceOutputObj|ClaimOutputObj)[];
  }
};

const encodeChild = (id: PointChild['id']): PointOutputObj|EvidenceOutputObj|ClaimOutputObj|undefined => {
  if(id_is_mPoint(id)) return encodePoint(id);
  if(id_is_mEvidence(id)) return encodeEvidence(id);
  if(id_is_mClaim(id)) return encodeClaim(id);
  return undefined;
}
const isChildObj = (v: ReturnType<typeof encodeChild>): v is (PointOutputObj | EvidenceOutputObj | ClaimOutputObj) => v!==undefined;

export const encodePoint = (id: mPoint['id']): PointOutputObj|undefined => {
  const model = get_from_id(id);
  if(!is_mPoint(model)) return undefined;
  return {
    point: {
      '@id': id,
      '@numbering': model['numbering'],
      '@rebut_to': model['rebut_to'],
      '#': model.contents?.map(encodeChild).filter(isChildObj)??[],
    }
  };
}

export interface PointInputObj {
  '#name': 'point';
  '$': {
    'id': string;
    'numbering'?: string;
    'rebut_to'?: string;
  };
  '$$'?: (PointInputObj|ClaimInputObj|EvidenceInputObj)[];
}
export const isPointInputObj = (v: unknown): v is PointInputObj =>{
  return isObject<PointInputObj>(v) && v['#name']==='point' && (Array.isArray(v['$$']) || v['$$']===undefined)
    && isObject<PointInputObj['$']>(v['$']) && typeof v['$'].id==='string';
};

const decodePointChild = (obj: object, parent: mPoint['id'], idMap: idMap): decodeResult<mPoint|mClaim|mEvidence> => {
  if(isObject<{'#name': string}>(obj)){
    if(obj['#name']==='point') return decodePoint(obj, parent, idMap);
    if(obj['#name']==='claim') return decodeClaim(obj, parent, idMap);
    if(obj['#name']==='evidence') return decodeEvidence(obj, parent, idMap);
  }
  return { id: undefined, idMap };
};

export const decodePoint = (obj: object, parent: mPart['id']|mPoint['id'], idMap: idMap): decodeResult<mPoint> => {
  if(!isPointInputObj(obj)) return { id: undefined, idMap };
  const rebut_to = obj['$'].rebut_to ? idMap.get(obj['$'].rebut_to) : undefined;
  const generated = generate_point(parent, {
    numbering: obj['$'].numbering,
    rebut_to: id_is_mPoint(rebut_to) ? rebut_to: undefined,
  }, true);
  idMap.set(obj['$'].id, generated.id);
  if(Array.isArray(obj['$$'])) idMap = obj['$$'].reduce((idMap, v) => decodePointChild(v, generated.id, idMap).idMap, idMap);
  return { id: generated.id, idMap };
};
