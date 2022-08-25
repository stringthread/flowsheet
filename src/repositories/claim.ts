import { is_mClaim, mClaim } from "models/mClaim";
import { get_from_id } from "services/id";

export interface ClaimOutputObj {
  claim: {
    '#': mClaim['contents'];
  }
}

export const encodeClaim = (id: mClaim['id']) : ClaimOutputObj|undefined => {
  const model = get_from_id(id);
  if(!is_mClaim(model)) return undefined;
  return {
    claim: {
      '#': model['contents'],
    }
  };
}
