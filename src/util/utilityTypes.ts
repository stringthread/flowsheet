export type ValueOf<T> = T;
export const assertNever = (v: never): never=>{
  throw TypeError(`Unexpected object: ${v}`);
}