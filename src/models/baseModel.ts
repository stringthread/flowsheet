import { ID_TYPE } from "stores/ids/id_generators";
export interface baseModel{
  type_signature: string;
  id: ID_TYPE;
  contents?: unknown;
}