type WouldBe<T> = { [P in keyof T]?: unknown };

export const isObject = <T extends object>(value: unknown): value is WouldBe<T> => {
  return typeof value === 'object' && value !== null;
};

type typenames = 'undefined' | 'object' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function';
type typenames2type<T extends typenames> = T extends 'undefined'
  ? undefined
  : T extends 'object'
  ? object
  : T extends 'boolean'
  ? boolean
  : T extends 'number'
  ? number
  : T extends 'bigint'
  ? bigint
  : T extends 'string'
  ? string
  : T extends 'symbol'
  ? symbol
  : T extends 'function'
  ? (...args: any[]) => unknown
  : never;
export const multipleTypeof = (value: unknown, test_types: Array<typenames>): boolean => {
  return test_types.includes(typeof value);
};
export const arrayTypeof = <T extends typenames>(arr: unknown, test_types: T | T[]): arr is Array<typenames2type<T>> =>
  Array.isArray(arr) && arr.every((v) => multipleTypeof(v, typeof test_types === 'string' ? [test_types] : test_types));
