import { Slice } from "@reduxjs/toolkit";
import { store } from "stores";
import { EntityStateWithLastID } from "stores/slices/EntityStateWithLastID";
import { AdaptRequiredState, Overwrite } from "util/utilityTypes";

export interface ModelId<Prefix extends string = string>  {
  id: string;
  prefix: Prefix;
}
export const isModelId = (v: unknown): v is ModelId => 
  (v instanceof Object && 'id' in v && 'type' in v && typeof v['id']==='string' && typeof v['type']==='string');

export interface rawBaseModel{
  id: ModelId;
  parent?: ModelId;
  contents?: unknown;
}

// T: 対応するrawModelの型
// P: parentの型
// C: contentsの型。contents?: Array<C>として解釈される
export abstract class BaseModel<
  T extends rawBaseModel = rawBaseModel,
  P extends BaseModel<rawBaseModel,any,any>|undefined = undefined,
  C extends any = undefined>{
  protected obj: T|undefined;
  // arg: baseModelIdの場合、this.updateObj(arg)
  // arg: Partial<T>&{id: any}の場合、this.updateObj(arg.id)
  // this.obj===undefinedのときのFallbackとして: arg: Partial<T>の場合、this.generate(arg)
  constructor(arg: Partial<T>|T['id']){
    if(isModelId(arg)) this.updateObj(arg);
    else {
      if('id' in arg) this.updateObj(arg.id);
      if(this.obj===undefined){
        const generated=this.generate(arg);
        this.obj=generated.obj;
      }
    }
  }
  getObj(): T | undefined {
    if(this.obj===undefined) return undefined;
    return  { ...this.obj };
  }
  updateObj(id?: T['id']): void {
    if(id===undefined){
      if(this.obj===undefined) return;
      id=this.obj.id;
    }
    const obj_in_store = this.getStore().entities[id.id];
    if(obj_in_store!==undefined) this.obj = obj_in_store;
  }
  toPlainObj(): T|undefined {
    this.updateObj();
    return this.obj;
  }
  abstract generate(from:Partial<T>): BaseModel<T,P,C>;
  abstract getSlice(): Slice;
  abstract getStore(): EntityStateWithLastID<T>;
  upsert(obj: Partial<Omit<T, 'id'>>): void {
    if(this.obj===undefined) return;
    store.dispatch(this.getSlice().actions.upsertOne({
      ...this.obj,
      id: this.obj.id,
    }));
    this.updateObj();
  }
  getContents(): T['contents']|undefined { return this.obj?.contents; }
  addChild: ((...args: any)=>C|undefined)|undefined = undefined;
  reorderChild: ((target: C, before: C|null)=>void)|undefined = undefined;
  getParent: (()=>P|undefined)|undefined = undefined;
  setParent: ((parent: P)=>void)|undefined = undefined;
}
