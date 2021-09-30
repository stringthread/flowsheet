type WouldBe<T> = { [P in keyof T]?: unknown }

export const isObject = <T extends object>(value: unknown): value is WouldBe<T> => {
  return typeof value === 'object' && value !== null;
}

type typenames = 'undefined'|'object'|'boolean'|'number'|'bigint'|'string'|'symbol'|'function';
export const multipleTypeof = (value: unknown, test_types: Array<typenames>): boolean =>{
  return test_types.includes(typeof value);
}
