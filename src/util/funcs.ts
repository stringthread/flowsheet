export const reorder_array=<T>(array:Array<T>,target:T,before:T|null):Array<T>=>{
  const result=array.filter(value=>(value!==target));
  if(result.length===array.length) return array; // targetに該当する要素がなければ何も変更しない
  const index=before!==null?result.indexOf(before):0;
  if(index===-1) return array; // beforeに該当する要素がなければ何も変更しない
  result.splice(index,0,target);
  return result;
}
