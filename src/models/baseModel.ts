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
  id: T['id'];
  // arg: baseModelIdの場合、this.updateObj(arg)
  // arg: Partial<T>&{id: any}の場合、this.updateObj(arg.id)
  // this.obj===undefinedのときのFallbackとして: arg: Partial<T>の場合、this.generate(arg)
  constructor(arg: Partial<T>|T['id']){
    let id: T['id']|undefined = undefined;
    if(isModelId(arg)) id=arg;
    else if('id' in arg && arg.id!==undefined) id=arg.id;
    if(id===undefined || this.objFromStore(id)===undefined) id = this.generate(isModelId(arg)?{}:arg).id;
    this.id = id;
  }
  get obj(): T|undefined { return this.objFromStore(this.id); }
  objFromStore(id: T['id']): T|undefined { return this.getStore().entities[id.id]; }
  abstract generate(from:Partial<T>): BaseModel<T,P,C>;
  abstract getSlice(): Slice;
  abstract getStore(): EntityStateWithLastID<T>;
  upsert(obj: Partial<Omit<T, 'id'>>): void {
    if(this.obj===undefined) return;
    store.dispatch(this.getSlice().actions.upsertOne({
      ...this.obj,
      id: this.obj.id,
    }));
  }
  getContents(): T['contents']|undefined { return this.obj?.contents; }
}
