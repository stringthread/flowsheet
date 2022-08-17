import { get_from_id } from 'services/id';
import { store } from 'stores';
import { generate_evidence_id } from 'stores/ids';
import { evidence_slice } from 'stores/slices/evidence';
import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import { PartiallyRequired } from 'util/utilityTypes';
import { rawBaseModel, BaseModel, ModelId, isModelId } from './baseModel';
import { mPoint, mPointId } from './mPoint';

export const evidence_id_prefix='evi_';
export type mEvidenceId = ModelId<typeof evidence_id_prefix>;
export const is_mEvidenceId=(v:unknown): v is mEvidenceId => isModelId(v) && v.prefix===evidence_id_prefix;
export const to_mEvidenceId=(seed:string): mEvidenceId => ({
  id: evidence_id_prefix + seed,
  prefix: evidence_id_prefix
});

export interface rawEvidence extends rawBaseModel {
  id: mEvidenceId;
  parent: mPointId;
  about_author?: string;
  author?: string;
  year?: number|string;
  contents?: string;
}

export class mEvidence extends BaseModel<rawEvidence, mPoint, never> {
  override generate(from:PartiallyRequired<rawEvidence, 'parent'>): mEvidence{
    const parent_obj=get_from_id(from.parent);
    if(!(parent_obj instanceof mPoint)) throw TypeError('argument `parent` does not match mPointId');
    const generated: rawEvidence= {
      ...from,
      id: generate_evidence_id(),
      parent: {...from.parent},
    };
    this.obj=generated;
    store.dispatch(this.getSlice().actions.add(generated));
    parent_obj.addChild(this);
    return this;
  }
  override getStore() { return store.getState().evidence; }
  override getSlice() { return evidence_slice; }
  getParent: (()=>mPoint|undefined)|undefined = () => {
    this.updateObj();
    if(this.obj?.parent===undefined) return undefined;
    return get_from_id(this.obj?.parent);
  }
  setParent: ((parent: mPoint)=>void)|undefined = (parent)=>{
    store.dispatch(this.getSlice().actions.setParent([ this.obj?.id, parent.getObj()?.id ]));
    parent.addChild(this);
    this.updateObj();
  };
}
