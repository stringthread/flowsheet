import { is_mEvidenceId, mEvidence, mEvidenceId } from 'models/mEvidence';
import { mClaim, is_mClaimId, mClaimId, claim_id_prefix } from 'models/mClaim';
import { mPoint, is_mPointId, mPointId, point_id_prefix, PointChild } from 'models/mPoint';
import { get_from_id } from './id';
import { is_mPartId, mPart, mPartId } from 'models/mPart';
import { assertNever } from 'util/utilityTypes';
import { next_content } from 'util/funcs';

export type accept_switch_for_append=mPart|mEvidence|mClaim|mPoint;
export const switch_for_append=<T>(
  model: accept_switch_for_append,
  part: (model:mPart)=>T,
  claim_evi: (model:mEvidence|mClaim)=>T,
  point: (model:mPoint)=>T
): T|undefined =>{
  if(model instanceof mPart) return part(model);
  if(model instanceof mClaim|| model instanceof mEvidence) return claim_evi(model);
  if(model instanceof mPoint) return point(model);
  assertNever(model);
};
export const append_sibling_point=(model: accept_switch_for_append): mPoint|undefined=>{
  return switch_for_append(
    model,
    (model)=>model?.addChild(),
    (model)=>{
      const parent=model?.getParent();
      if(parent===undefined||parent===null) return;
      return append_sibling_point(parent);
    },
    (model)=>{
      const parent=model?.getParent();
      if(parent===undefined) return;
      return switch_for_append(
        parent,
        (model)=>{
          const child = model.addChild();
          const siblings=model?.obj?.contents;
          if(siblings===undefined) return;
          const reorder_before=next_content(siblings, child?.id_obj);
          if(reorder_before===undefined) return;
          model.reorder_child(child.id_obj, reorder_before);
          return child;
        },
        ()=>{ throw TypeError('Invalid parent.id given in append_sibling_point') },
        ()=>{
          const child = model.addChild[point_id_prefix]();
          const siblings=model?.obj?.contents;
          if(siblings===undefined) return;
          const reorder_before=next_content(siblings, child?.id_obj);
          if(reorder_before===undefined) return;
          model.reorder_child(child.id_obj, reorder_before);
          return child;
        },
      );
    }
  );
};
export const append_point_to_part=(model: accept_switch_for_append): mPoint|undefined=>{
  let _parent: mPart|mPoint|PointChild|null|undefined = model;
  while(_parent && !(_parent instanceof mPart)){
    _parent=_parent.getParent();
  }
  let child:mPoint|undefined=undefined;
  if(_parent instanceof mPart) child=_parent.addChild();
  return child;
};
export const append_point_child=(model: accept_switch_for_append): mPoint|undefined=>{
  return switch_for_append(
    model,
    (model)=>model.addChild(),
    (model)=>{
      const parent=model.getParent();
      if(parent===undefined||parent===null) return;
      const child=append_point_child(parent);
      if(child===undefined) return;
      const contents = parent.obj?.contents;
      if(contents===undefined) return;
      const reorder_before=next_content(contents,model.id_obj);
      if(reorder_before===undefined) return;
      parent.reorder_child(child.id_obj, reorder_before);
      return child;
    },
    (model)=>model.addChild[point_id_prefix]()
  )
}
