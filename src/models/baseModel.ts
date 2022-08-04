import { ID_TYPE } from "stores/ids/id_generators";
export interface baseModel{
  typesigniture: symbol;
  id: ID_TYPE;
  contents?: unknown;
}