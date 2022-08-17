import { get_from_id } from 'services/id';
import { store } from 'stores';
import { generate_claim_id } from 'stores/ids/id_generators';
import { claim_slice } from 'stores/slices/claim';
import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import { Overwrite, PartiallyRequired } from 'util/utilityTypes';
import { rawBaseModel, ModelId, BaseModel, isModelId } from './baseModel';
import { mPoint, mPointId } from './mPoint';

export const claim_id_prefix='claim_';
export type mClaimId = ModelId<typeof claim_id_prefix>;
export const is_mClaimId=(v: unknown): v is mClaimId => isModelId(v) && v.prefix===claim_id_prefix;
export const to_mClaimId=(seed:string): mClaimId => ({
  id: claim_id_prefix + seed,
  prefix: claim_id_prefix
});

export interface rawClaim extends rawBaseModel {
  id: mClaimId;
  parent: mPointId;
  contents?: string;
}

export class mClaim extends BaseModel<rawClaim, mPoint, never> {
  override generate(from:PartiallyRequired<rawClaim, 'parent'>): mClaim{
    const parent_obj=get_from_id(from.parent);
    if(!(parent_obj instanceof mPoint)) throw TypeError('argument `parent` does not match mPointId');
    this.obj = {
      ...from,
      id: generate_claim_id(),
      parent: {...from.parent},
    };
    store.dispatch(this.getSlice().actions.add(this.obj));
    parent_obj.addChild(this);
    return this;
  }
  override getSlice() { return claim_slice; }
  override getStore() { return store.getState().claim; };
  getParent: ()=>mPoint|undefined = () => {
    this.updateObj();
    if(this.obj?.parent===undefined) return undefined;
    return get_from_id(this.obj?.parent);
  }
  setParent: (parent: mPoint)=>void = (parent)=>{
    store.dispatch(this.getSlice().actions.setParent([ this.obj?.id, parent.getObj()?.id ]));
    parent.addChild(this);
    this.updateObj();
  }
}
