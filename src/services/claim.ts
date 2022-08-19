import { mClaim, claim_id_prefix } from "models/mClaim";
import { accept_switch_for_append, switch_for_append } from "./point";

export const append_claim=(parent_id: accept_switch_for_append): mClaim|undefined=>{
  return switch_for_append(
    parent_id,
    (model)=>append_claim(model.addChild()),
    (model)=>{
      const parent=model.getParent();
      if(parent!==undefined) return append_claim(parent);
    },
    (model)=>model.addChild[claim_id_prefix]()
  );
};
