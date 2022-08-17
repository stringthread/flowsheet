export type ValueOf<T> = T;
export type PartiallyPartial<T, K extends keyof T> = Omit<T,K> & Partial<Pick<T,K>>;
export type PartiallyRequired<T, K extends keyof T> = Pick<T,K> & Required<Pick<T,K>>;
export type Equals<T,U> = T extends U ? U extends T ? true : false : false;
export type Overwrite<T,U> = Omit<T, keyof U> & U;
type filterPartial<T> = {
  [K in keyof Required<T>]: T[K] & undefined extends never ? never : K;
}
type filterRequired<T> = {
  [K in keyof Required<T>]: T[K] & undefined extends never ? K : never;
}
type concatenateNonNever<T> = T extends {[_ in keyof T]: infer X} ? X : never;
export type keyofPartial<T> = concatenateNonNever<filterPartial<T>>;
export type keyofRequired<T> = concatenateNonNever<filterRequired<T>>;

// UのプロパティについてTでRequiredならRequired、その他はPartialにする
export type AdaptRequiredState<T,U> = Partial<{
  [K in keyofPartial<T>&keyof U]: U[K];
}> & Required<{
  [K in keyofRequired<T>&keyof U]: U[K];
}>;
export function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}