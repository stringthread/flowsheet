import { get_from_id } from 'services/id';
import { store } from 'stores';
import { generate_part_id } from 'stores/ids/id_generators';
import { EntityStateWithLastID } from 'stores/slices/EntityStateWithLastID';
import { part_slice } from 'stores/slices/part';
import {isObject} from 'util/typeGuardUtils';
import { PartiallyRequired } from 'util/utilityTypes';
import {rawBaseModel, isModelId, ModelId, BaseModel} from './baseModel';
import { mPoint, mPointId } from './mPoint';
import { mSide, mSideId } from './mSide';

export const part_id_prefix='part_';
export type mPartId = ModelId<typeof part_id_prefix>;
export const is_mPartId=(v: unknown): v is mPartId => isModelId(v) && v.prefix===part_id_prefix;
export const to_mPartId=(seed:string): mPartId => ({
  id: part_id_prefix + seed,
  prefix: part_id_prefix
});

export interface rawPart extends rawBaseModel {
  id: mPartId;
  parent: mSideId;
  name?: string|number;
  contents?: Array<mPointId>;
}

export class mPart extends BaseModel<rawPart, mSide, mPoint> {
  override generate(from:PartiallyRequired<rawPart, 'parent'>): mPart{
    const parent_obj=get_from_id(from.parent);
    if(!(parent_obj instanceof mPart)) throw TypeError('argument `parent` does not match mSideId');
    const generated: rawPart= {
      ...from,
      id: generate_part_id(),
      parent: from.parent,
    };
    this.obj=generated;
    store.dispatch(this.getSlice().actions.add(generated));
    parent_obj.addChild(this);
    return this;
  }
  override getSlice() { return part_slice; }
  override getStore(): EntityStateWithLastID<rawPart> {
    return store.getState().part;
  };
  addChild: (child?: mPoint) => mPoint|undefined = (child)=>{
    const parent_id=this.obj?.id;
    if(parent_id===undefined) return undefined;
    if(child===undefined) return new mPoint({parent: parent_id});
    store.dispatch(this.getSlice().actions.addChild([parent_id, child.getObj()?.id]));
    return child;
  };
  getParent: () => mSide|undefined = () => {
    this.updateObj();
    if(this.obj?.parent===undefined) return undefined;
    return get_from_id(this.obj?.parent);
  }
  setParent: (parent: mSide)=>void = (parent)=>{
    store.dispatch(this.getSlice().actions.setParent([ this.obj?.id, parent.getObj()?.id ]));
    parent.addChild(this);
    this.updateObj();
  }
}
