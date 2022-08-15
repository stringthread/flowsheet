import { Slice } from "@reduxjs/toolkit";
import { store } from "stores";
import { EntityStateWithLastID } from "stores/slices/EntityStateWithLastID";

export interface rawBaseModel{
  id: string;
  contents?: unknown;
}

export abstract class baseModelId<T extends BaseModel<rawBaseModel> = BaseModel<rawBaseModel>>{
  readonly plainId: string;
  constructor(id: string){
    this.plainId=id;
  };
  abstract getStore(): EntityStateWithLastID<T>;
  getObj(): T|undefined{
    return this.getStore().entities[this.plainId];
  }
};

export type methodOptions = {
  [k: string]: any;
};
// T: 対応するrawModelの型
export abstract class BaseModel<T extends rawBaseModel = rawBaseModel>{
  id: baseModelId<BaseModel<T>>;
  obj: T|undefined;
  constructor(id: baseModelId<BaseModel<T>>);
  constructor(option?: methodOptions, from?:Partial<T>);
  constructor(arg1?: methodOptions|baseModelId<BaseModel<T>>, arg2?: Partial<T>){
    if(arg1 instanceof baseModelId<BaseModel<T>>){
      this.id=arg1;
      this.obj=arg1.getObj()?.obj;
    } else {
      const generated=this.generate(arg1, arg2);
      this.id=generated.id;
      this.obj=generated.obj;
    }
  }
  toPlainObj(): T|undefined {
    return this.obj ? { ...this.obj, id: this.id.plainId } : undefined;
  }
  abstract generate(option?: methodOptions, from?:Partial<T>): BaseModel<T>;
  abstract getSlice(): Slice<EntityStateWithLastID<rawBaseModel>>;
  upsert(obj: typeof this.obj): void {
    store.dispatch(this.getSlice().actions.upsertOne({
      id: this.id.plainId,
      contents: obj,
    }));
    this.obj = this.id.getObj()?.toPlainObj();
  }
  getContents(): T['contents']|undefined { return this.obj?.contents; }
  addChild: (()=>baseModelId)|undefined = undefined;
  reorderChild: (()=>boolean)|undefined = undefined;
  getParent: (()=>BaseModel|undefined)|undefined = undefined;
  setParent: (()=>boolean)|undefined = undefined;
}
