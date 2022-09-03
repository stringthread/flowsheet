import { is_mEvidence, mEvidence } from "models/mEvidence";
import { mPoint } from "models/mPoint";
import { generate_evidence } from "services/evidence";
import { get_from_id } from "services/id";
import { isObject } from "util/typeGuardUtils";
import { decodeResult, idMap } from "./loader";

export interface EvidenceOutputObj {
  evidence: {
    '@id': mEvidence['id'],
    '@about_author'?: mEvidence['about_author'];
    '@author'?: mEvidence['author'];
    '@year'?: mEvidence['year'];
    '#'?: mEvidence['contents'];
  }
}

export const encodeEvidence = (id: mEvidence['id']) : EvidenceOutputObj|undefined => {
  const model = get_from_id(id);
  if(!is_mEvidence(model)) return undefined;
  return {
    evidence: {
      '@id': id,
      '@about_author': model['about_author'],
      '@author': model['author'],
      '@year': model['year'],
      '#': model['contents'],
    }
  };
}

export interface EvidenceInputObj {
  '#name': 'evidence';
  '_': string;
  '$': {
    'id': string;
    'about_author'?: string;
    'author'?: string;
    'year'?: string;
  }
}
export const isEvidenceInputObj = (v: unknown): v is EvidenceInputObj =>{
  return isObject<EvidenceInputObj>(v) && v['#name']==='evidence' && typeof v['_']==='string'
    && isObject<EvidenceInputObj['$']>(v['$']) && typeof v['$'].id==='string';
};

export const decodeEvidence = (obj: object, parent: mPoint['id'], idMap: idMap): decodeResult<mEvidence> => {
  if(!isEvidenceInputObj(obj)) return { id: undefined, idMap };
  const generated = generate_evidence(parent, {
    contents: obj['_'],
    about_author: obj['$'].about_author,
    author: obj['$'].author,
    year: obj['$'].year,
  });
  idMap.set(obj['$'].id, generated.id);
  return { id: generated.id, idMap };
};
