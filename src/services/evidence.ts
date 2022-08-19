import { mEvidence, evidence_id_prefix } from "models/mEvidence";
import { accept_switch_for_append, switch_for_append } from "./point";

export const append_evidence=(parent_id: accept_switch_for_append): mEvidence|undefined=>{
  return switch_for_append(
    parent_id,
    (model)=>append_evidence(model.addChild()),
    (model)=>{
      const parent=model.getParent();
      if(parent!==undefined) return append_evidence(parent);
    },
    (model)=>model.addChild[evidence_id_prefix]()
  );
};
