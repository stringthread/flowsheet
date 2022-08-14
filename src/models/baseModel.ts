declare const idSymbol: unique symbol;
export type ID_TYPE=string&{[idSymbol]: never};
export const is_ID_TYPE=(value: string): value is ID_TYPE=>true;
export const to_ID_TYPE=(seed:string): ID_TYPE => seed as ID_TYPE;

export interface baseModel{
  type_signature: string;
  id: ID_TYPE;
  contents?: unknown;
}