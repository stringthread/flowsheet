import { rawBaseModel, ModelId, BaseModel, isModelId } from './baseModel';
import {evidence_id_prefix, is_mEvidenceId, mEvidence, mEvidenceId} from './mEvidence';
import {claim_id_prefix, is_mClaimId, mClaim, mClaimId} from './mClaim';
import {isObject} from 'util/typeGuardUtils';
import { is_mPartId, mPart, mPartId } from './mPart';
import { assertNever, PartiallyRequired } from 'util/utilityTypes';
import { generate_point_id } from 'stores/ids/id_generators';
import { store } from 'stores';
import { EntityStateWithLastID } from 'stores/slices/EntityStateWithLastID';
import { point_slice } from 'stores/slices/point';
import { get_from_id } from 'services/id';
import { part_slice } from 'stores/slices/part';

export const point_id_prefix='point_';
export type mPointId = ModelId<typeof point_id_prefix>;
export const is_mPointId=(v: unknown): v is mPointId => isModelId(v) && v.prefix===point_id_prefix;
export const to_mPointId=(seed:string): mPointId => ({
  id: point_id_prefix + seed,
  prefix: point_id_prefix
});

export type PointChild = mPoint|mEvidence|mClaim;
export type PointChildId = mPointId|mEvidenceId|mClaimId;

export type PointParent = mPoint|mPart;
export type PointParentId = mPointId|mPartId;
export const is_PointParentId = (v: unknown): v is PointParentId => is_mPointId(v)||is_mPartId(v);

export interface rawPoint extends rawBaseModel {
  id_obj: mPointId;
  parent: PointParentId;
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<PointChildId>;
}
export const is_rawPoint = (v: unknown): v is rawPoint => v instanceof Object && 'id' in v && is_mPointId(v['id']) && 'parent' in v && is_PointParentId(v['parent']);

export class mPoint extends BaseModel<rawPoint, PointParent, PointChild> {
  override generate(from:PartiallyRequired<rawPoint, 'parent'>): mPoint{
    const parent_obj=get_from_id(from.parent);
    if(!(parent_obj instanceof mPoint) && !(parent_obj instanceof mPart)) throw TypeError('argument `parent` does not match PointParentId');
    this.id_obj = generate_point_id();
    const generated: rawPoint= {
      ...from,
      id_obj: this.id_obj,
      id: this.id_obj.id,
      parent: from.parent,
    };
    store.dispatch(this.getSlice().actions.add(generated));
    parent_obj.setChild(this);
    return this;
  }
  override getSlice() { return point_slice; }
  override getStore(): EntityStateWithLastID<rawPoint> {
    return store.getState().point;
  };
  addChild = {
    [point_id_prefix]: ()=>new mPoint({parent: this.id_obj}),
    [evidence_id_prefix]: ()=>new mEvidence({parent: this.id_obj}),
    [claim_id_prefix]: ()=>new mClaim({parent: this.id_obj}),
  };
  setChild: (child:PointChild)=>void = (child)=>{
    store.dispatch(point_slice.actions.addChild([this.id_obj, child.id_obj]));
    child.setParent(this);
  }
  reorder_child: (target:PointChildId, before:PointChildId|null) => void = (target, before) =>{
    store.dispatch(point_slice.actions.reorderChild([this.id_obj,target,before]));
  };
  getParent: ()=>(PointParent|undefined) = () => {
    if(this.obj?.parent===undefined) return undefined;
    return get_from_id(this.obj?.parent);
  }
  setParent: (parent: PointParent)=>void = (parent)=>{
    store.dispatch(this.getSlice().actions.setParent([ this.id_obj, parent.id_obj ]));
    if(parent instanceof mPoint) store.dispatch(point_slice.actions.addChild([ parent.id_obj, this.id_obj ]));
    else store.dispatch(part_slice.actions.addChild([ parent.id_obj, this.id_obj ]));
  }
}
