import { Slice } from "@reduxjs/toolkit";
import { store } from "stores";
import { EntityStateWithLastID } from "stores/slices/EntityStateWithLastID";
import { AdaptRequiredState, Overwrite } from "util/utilityTypes";

export interface ModelId<Prefix extends string = string>  {
  id: string;
  prefix: Prefix;
}
export const isModelId = (v: unknown): v is ModelId => 
  (v instanceof Object && 'id' in v && 'prefix' in v && typeof v['id']==='string' && typeof v['prefix']==='string');

export interface rawBaseModel{
  id: string;
  id_obj: ModelId;
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
  id_obj: T['id_obj'];
  // arg: baseModelIdの場合、this.updateObj(arg)
  // arg: Partial<T>&{id: any}の場合、this.updateObj(arg.id)
  // this.obj===undefinedのときのFallbackとして: arg: Partial<T>の場合、this.generate(arg)
  constructor(arg: Partial<T>|T['id_obj']){
    let id_obj: T['id_obj']|undefined = undefined;
    if(isModelId(arg)) id_obj=arg;
    else if('id_obj' in arg && arg.id_obj!==undefined) id_obj=arg.id_obj;
    if(id_obj===undefined || this.objFromStore(id_obj)===undefined) id_obj = this.generate(isModelId(arg)?{}:arg).id_obj;
    this.id_obj = id_obj;
  }
  get obj(): T|undefined { return this.objFromStore(this.id_obj); }
  objFromStore(id: T['id_obj']): T|undefined { return this.getStore().entities[id.id]; }
  abstract generate(from:Partial<T>): BaseModel<T,P,C>;
  abstract getSlice(): Slice;
  abstract getStore(): EntityStateWithLastID<T>;
  upsert(obj: Partial<Omit<T, 'id'>>): void {
    if(this.obj===undefined) return;
    store.dispatch(this.getSlice().actions.upsertOne({
      ...this.obj,
      ...obj,
      id_obj: this.id_obj,
      id: this.id_obj.id
    }));
  }
  getContents(): T['contents']|undefined { return this.obj?.contents; }
}
