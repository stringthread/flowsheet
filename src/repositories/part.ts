import { decodeResult, idMap } from './loader';
import { decodePoint, encodePoint, PointInputObj, PointOutputObj } from './point';
import { is_mPart, mPart } from 'models/mPart';
import { mSide } from 'models/mSide';
import { get_from_id } from 'services/id';
import { generate_part, part_set_child } from 'services/part';
import { isObject } from 'util/typeGuardUtils';

export interface PartOutputObj {
  part: {
    '@id': mPart['id'];
    '@name'?: mPart['name'];
    '#'?: PointOutputObj[];
  };
}

const isChildObj = (v: PointOutputObj | undefined): v is PointOutputObj => v !== undefined;
export const encodePart = (id: mPart['id']): PartOutputObj | undefined => {
  const model = get_from_id(id);
  if (!is_mPart(model)) return undefined;
  return {
    part: {
      '@id': id,
      '@name': model['name'],
      '#': model.contents?.map(encodePoint).filter(isChildObj),
    },
  };
};

export interface PartInputObj {
  '#name': 'part';
  '$': {
    id: string;
    name?: string;
  };
  '$$'?: PointInputObj[];
}
export const isPartInputObj = (v: unknown): v is PartInputObj => {
  return (
    isObject<PartInputObj>(v) &&
    v['#name'] === 'part' &&
    (Array.isArray(v['$$']) || v['$$'] === undefined) &&
    isObject<PartInputObj['$']>(v['$']) &&
    typeof v['$'].id === 'string'
  );
};

export const decodePart = (obj: object, parent: mSide['id'], idMap: idMap): decodeResult<mPart> => {
  if (!isPartInputObj(obj)) return { id: undefined, idMap };
  const generated = generate_part(
    parent,
    {
      name: obj['$'].name,
    },
    true,
  );
  idMap.set(obj['$'].id, generated.id);
  if (Array.isArray(obj['$$']))
    idMap = obj['$$'].reduce((idMap, v) => decodePoint(v, generated.id, idMap).idMap, idMap);
  return { id: generated.id, idMap };
};
