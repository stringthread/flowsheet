import { get_from_id } from 'services/id';
import { store } from 'stores';
import { generate_side_id } from 'stores/ids/id_generators';
import { EntityStateWithLastID } from 'stores/slices/EntityStateWithLastID';
import { side_slice } from 'stores/slices/side';
import {isObject} from 'util/typeGuardUtils';
import { PartiallyRequired } from 'util/utilityTypes';
import {BaseModel, isModelId, ModelId, rawBaseModel} from './baseModel';
import { mMatch, mMatchId } from './mMatch';
import { mPart, mPartId } from './mPart';

export const side_id_prefix='side_';
export type mSideId = ModelId<typeof side_id_prefix>;
export const is_mSideId=(v:unknown): v is mSideId => isModelId(v) && v.prefix===side_id_prefix;
export const to_mSideId=(seed:string): mSideId => ({
  id: side_id_prefix + seed,
  prefix: side_id_prefix
});

export interface rawSide extends rawBaseModel {
  id_obj: mSideId;
  side?: string; // TODO: enumにする
  parent: mMatchId;
  contents?: Array<mPartId>;
}

export class mSide extends BaseModel<rawSide, mMatch, mPart> {
  override generate(from:PartiallyRequired<rawSide, 'parent'>): mSide{
    const parent_obj=get_from_id(from.parent);
    if(!(parent_obj instanceof mMatch)) throw TypeError('argument `parent` does not match mMatchId');
    this.id_obj = generate_side_id();
    const generated: rawSide= {
      ...from,
      id_obj: this.id_obj,
      id: this.id_obj.id,
      parent: from.parent,
    };
    store.dispatch(this.getSlice().actions.add(generated));
    parent_obj.addChild(this);
    return this;
  }
  override getSlice() { return side_slice; }
  override getStore() { return store.getState().side; }
  addChild: (child?: mPart) => mPart|undefined = (child)=>{
    if(child===undefined) return new mPart({parent: this.id_obj});
    store.dispatch(this.getSlice().actions.addChild([this.id_obj, child.id_obj]));
    return child;
  };
  getParent: (child?: mMatch) => (mMatch|undefined) = (child) => {
    const parent_id = this.obj?.parent;
    if(parent_id===undefined) return undefined;
    if(child===undefined) return get_from_id(parent_id);
  };
  setParent: (parent: mMatch)=>void = (parent)=>{
    store.dispatch(this.getSlice().actions.setParent([ this.id_obj, parent.id_obj ]));
    parent.addChild(this);
  };
}
