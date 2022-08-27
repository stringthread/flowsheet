import { is_mEvidence, mEvidence } from "models/mEvidence";
import { get_from_id } from "services/id";

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
