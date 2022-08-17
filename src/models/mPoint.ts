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

export interface rawPoint extends rawBaseModel {
  id: mPointId;
  parent: PointParentId;
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<PointChildId>;
}

export class mPoint extends BaseModel<rawPoint, PointParent, PointChild> {
  override generate(from:PartiallyRequired<rawPoint, 'parent'>): mPoint{
    const parent_obj=get_from_id(from.parent);
    if(!(parent_obj instanceof mPoint) && !(parent_obj instanceof mPart)) throw TypeError('argument `parent` does not match PointParentId');
    const generated: rawPoint= {
      ...from,
      id: generate_point_id(),
      parent: from.parent,
    };
    this.obj=generated;
    store.dispatch(this.getSlice().actions.add(generated));
    parent_obj.addChild(this);
    return this;
  }
  override getSlice() { return point_slice; }
  override getStore(): EntityStateWithLastID<rawPoint> {
    return store.getState().point;
  };
  addChild: (arg: PointChild|PointChildId['prefix']) => PointChild|undefined = (arg)=>{
    const parent_id=this.obj?.id;
    if(parent_id===undefined) return undefined;
    if(arg instanceof BaseModel){
      store.dispatch(this.getSlice().actions.addChild([parent_id, arg.getObj()?.id]));
      return arg;
    } else {
      if(arg===point_id_prefix) return new mPoint({parent: parent_id});
      else if(arg===evidence_id_prefix) return new mEvidence({parent: parent_id});
      else if(arg===claim_id_prefix) return new mClaim({parent: parent_id});
      else assertNever(arg);
    }
  };
  getParent: ()=>PointParent|undefined = () => {
    this.updateObj();
    if(this.obj?.parent===undefined) return undefined;
    return get_from_id(this.obj?.parent);
  }
  setParent: (parent: PointParent)=>void = (parent)=>{
    store.dispatch(this.getSlice().actions.setParent([ this.obj?.id, parent.getObj()?.id ]));
    parent.addChild(this);
    this.updateObj();
  }
}
