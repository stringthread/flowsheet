import { is_mClaim } from "models/mClaim";
import { is_mEvidence } from "models/mEvidence";
import { is_mPoint, mPoint, PointChild } from "models/mPoint";
import { get_from_id } from "services/id";
import { ClaimOutputObj, encodeClaim } from "./claim";
import { encodeEvidence, EvidenceOutputObj } from "./evidence";

export interface PointOutputObj {
  point: {
    '@id': mPoint['id'];
    '@numbering'?: mPoint['numbering'];
    '@rebut_to'?: mPoint['rebut_to'];
    '#'?: (PointOutputObj|EvidenceOutputObj|ClaimOutputObj)[];
  }
};

const encodeChild = (id: PointChild['id']): PointOutputObj|EvidenceOutputObj|ClaimOutputObj|undefined => {
  const obj = get_from_id(id);
  if(is_mPoint(obj)) return encodePoint(id);
  if(is_mEvidence(obj)) return encodeEvidence(id);
  if(is_mClaim(obj)) return encodeClaim(id);
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
