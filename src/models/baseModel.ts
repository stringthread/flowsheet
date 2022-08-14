declare const idSymbol: unique symbol;
export type BASE_ID_TYPE=string&{[idSymbol]: never};
export const is_ID_TYPE=(value: string): value is BASE_ID_TYPE=>true;
export const to_ID_TYPE=(seed:string): BASE_ID_TYPE => seed as BASE_ID_TYPE;

export interface baseModel{
  type_signature: string;
  id: BASE_ID_TYPE;
  contents?: unknown;
}