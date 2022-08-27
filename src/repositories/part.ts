import { is_mPart, mPart } from "models/mPart";
import { get_from_id } from "services/id";
import { encodePoint, PointOutputObj } from "./point";

export interface PartOutputObj {
  part: {
    '@id': mPart['id'];
    '@name'?: mPart['name'];
    '#'?: PointOutputObj[];
  }
};

const isChildObj = (v: PointOutputObj|undefined) : v is PointOutputObj => v!==undefined;
export const encodePart = (id: mPart['id']): PartOutputObj|undefined => {
  const model = get_from_id(id);
  if(!is_mPart(model)) return undefined;
  return {
    part: {
      '@id': id,
      '@name': model['name'],
      '#': model.contents?.map(encodePoint).filter(isChildObj),
    }
  };
}
