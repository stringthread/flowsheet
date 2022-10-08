import { decodeResult, idMap } from './loader';
import { is_mClaim, mClaim } from 'models/mClaim';
import { mPoint } from 'models/mPoint';
import { generate_claim } from 'services/claim';
import { get_from_id } from 'services/id';
import { isObject } from 'util/typeGuardUtils';

export interface ClaimOutputObj {
  claim: {
    '@id': mClaim['id'];
    '#': mClaim['contents'];
  };
}

export const encodeClaim = (id: mClaim['id']): ClaimOutputObj | undefined => {
  const model = get_from_id(id);
  if (!is_mClaim(model)) return undefined;
  return {
    claim: {
      '@id': id,
      '#': model['contents'],
    },
  };
};

export interface ClaimInputObj {
  '#name': 'claim';
  '_': string;
  '$': {
    id: string;
  };
}
export const isClaimInputObj = (v: unknown): v is ClaimInputObj => {
  return (
    isObject<ClaimInputObj>(v) &&
    v['#name'] === 'claim' &&
    typeof v['_'] === 'string' &&
    isObject<ClaimInputObj['$']>(v['$']) &&
    typeof v['$'].id === 'string'
  );
};

export const decodeClaim = (obj: object, parent: mPoint['id'], idMap: idMap): decodeResult<mClaim> => {
  if (!isClaimInputObj(obj)) return { id: undefined, idMap };
  const generated = generate_claim(parent, { contents: obj['_'] });
  idMap.set(obj['$'].id, generated.id);
  return { id: generated.id, idMap };
};
