import { decodeMatch, MetaInputObj, MatchInputObj } from './match';
import deepmerge from 'deepmerge';
import { ID_TYPE } from 'models';
import { baseModel } from 'models/baseModel';
import { mMatch } from 'models/mMatch';
import { isObject } from 'util/typeGuardUtils';
import xml2js from 'xml2js';

export type idMap = Map<string, ID_TYPE>;
export interface decodeResult<T extends baseModel> {
  id: T['id'] | undefined;
  idMap: idMap;
}
interface dflow_obj {
  root: {
    '#name': 'root';
    'meta': MetaInputObj[];
    'match': MatchInputObj[];
  };
}
const is_dflow_obj = (v: unknown): v is dflow_obj => {
  return (
    isObject<dflow_obj>(v) &&
    isObject<dflow_obj['root']>(v.root) &&
    Array.isArray(v.root.meta) &&
    Array.isArray(v.root.match)
  );
};

const decodeXML_obj = (obj: object): decodeResult<mMatch> => {
  const idMap: idMap = new Map();
  if (!is_dflow_obj(obj)) return { id: undefined, idMap };
  return decodeMatch(
    {
      meta: deepmerge.all(obj.root.meta),
      match: obj.root.match[0],
    },
    idMap,
  );
};

export const string_to_mMatch = async (xml: string): Promise<mMatch['id'] | undefined> => {
  const xml_obj = await xml2js.parseStringPromise(xml, {
    explicitChildren: true,
    preserveChildrenOrder: true,
  });
  return decodeXML_obj(xml_obj)?.id;
};
