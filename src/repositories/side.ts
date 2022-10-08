import { decodeResult, idMap } from './loader';
import { decodePart, encodePart, PartInputObj, PartOutputObj } from './part';
import { is_mSide, mSide } from 'models/mSide';
import { get_from_id } from 'services/id';
import { generate_side } from 'services/side';
import { isObject } from 'util/typeGuardUtils';

export interface SideOutputObj {
  side: {
    '@id': mSide['id'];
    '@side'?: mSide['side'];
    '#'?: PartOutputObj[];
  };
}

const isChildObj = (v: PartOutputObj | undefined): v is PartOutputObj => v !== undefined;
export const encodeSide = (id: mSide['id']): SideOutputObj | undefined => {
  const model = get_from_id(id);
  if (!is_mSide(model)) return undefined;
  return {
    side: {
      '@id': id,
      '@side': model['side'],
      '#': model.contents?.map(encodePart).filter(isChildObj),
    },
  };
};

export interface SideInputObj {
  '#name': 'side';
  '$': {
    id: string;
    side?: string;
  };
  '$$'?: PartInputObj[];
}
export const isSideInputObj = (v: unknown): v is SideInputObj => {
  return (
    isObject<SideInputObj>(v) &&
    v['#name'] === 'side' &&
    (Array.isArray(v['$$']) || v['$$'] === undefined) &&
    isObject<SideInputObj['$']>(v['$']) &&
    typeof v['$'].id === 'string'
  );
};

export const decodeSide = (obj: object, parent: mSide['parent'], idMap: idMap): decodeResult<mSide> => {
  if (!isSideInputObj(obj)) return { id: undefined, idMap };
  const generated = generate_side(parent, undefined, {
    side: obj['$'].side,
  });
  idMap.set(obj['$'].id, generated.id);
  if (Array.isArray(obj['$$'])) idMap = obj['$$'].reduce((idMap, v) => decodePart(v, generated.id, idMap).idMap, idMap);
  return { id: generated.id, idMap };
};
