// array上でtargetに対応する要素をberofeの前に移動する. before===nullなら末尾に移動する
export function reorder_array<T>(array:Array<T>,target:T,before:T|null):Array<T>;
export function reorder_array<T,U>(array:Array<T>,target:U,before:U|null,func:(e:T,t:U)=>boolean):Array<T>;
export function reorder_array<T,U>(array:Array<T>,target:U,before:U|null,func?:(e:T,t:U)=>boolean):Array<T>{
  if(func===undefined) func=(e,t)=>e===(t as any as T); // funcがないのは1つ目の定義のみ
  const _func=func as Exclude<typeof func,undefined>;// 前行でfuncがundefinedでないことは保証できる
  const target_elem=array.find(e=>_func(e,target));
  if(target_elem===undefined) return array;
  const result=array.filter(e=>!_func(e,target));
  const index=before!==null?result.findIndex(e=>_func(e,before)):result.length;
  if(index===-1) return array; // beforeに該当する要素がなければ何も変更しない
  result.splice(index,0,target_elem);
  return result;
}
