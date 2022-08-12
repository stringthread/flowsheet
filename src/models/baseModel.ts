import { ID_TYPE } from "stores/ids/id_generators";
export interface baseModel{
  typesigniture: string;
  id: ID_TYPE;
  contents?: unknown;
}