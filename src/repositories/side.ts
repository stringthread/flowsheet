import { is_mSide, mSide } from "models/mSide";
import { get_from_id } from "services/id";
import { encodePart, PartOutputObj } from "./part";

export interface SideOutputObj {
  side: {
    '@id': mSide['id'];
    '@side'?: mSide['side'];
    '#'?: PartOutputObj[];
  }
};

const isChildObj = (v: PartOutputObj|undefined) : v is PartOutputObj => v!==undefined;
export const encodeSide = (id: mSide['id']): SideOutputObj|undefined => {
  const model = get_from_id(id);
  if(!is_mSide(model)) return undefined;
  return {
    side: {
      '@id': id,
      '@side': model['side'],
      '#': model.contents?.map(encodePart).filter(isChildObj),
    }
  };
}
