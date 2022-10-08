import { decodeResult, idMap } from './loader';
import { decodeSide, encodeSide, SideInputObj, SideOutputObj } from './side';
import { is_mMatch, mMatch } from 'models/mMatch';
import { get_from_id } from 'services/id';
import { generate_match } from 'services/match';
import { map_object, map_to_object } from 'util/funcs';
import { arrayTypeof, isObject, multipleTypeof } from 'util/typeGuardUtils';

export interface MatchOutputObj {
  meta: {
    topic?: mMatch['topic'];
    date?: mMatch['date'];
    side?: mMatch['side'];
    winner?: mMatch['winner'];
    opponent?: mMatch['opponent'];
    members?: {
      '@part': string | number;
      '_': string;
    }[];
    note?: mMatch['note'];
  };
  match?: {
    '@id': mMatch['id'];
    '#'?: SideOutputObj[];
  };
}

const isChildObj = (v: SideOutputObj | undefined): v is SideOutputObj => v !== undefined;
export const encodeMatch = (id: mMatch['id']): MatchOutputObj | undefined => {
  const model = get_from_id(id);
  if (!is_mMatch(model)) return undefined;
  return {
    meta: {
      topic: model['topic'],
      date: model['date'],
      side: model['side'],
      winner: model['winner'],
      opponent: model['opponent'],
      members: model['member'] ? map_object(model['member'], (v, k) => ({ '@part': k, '_': v })) : [],
      note: model['note'],
    },
    match: {
      '@id': id,
      '#': model.contents?.map(encodeSide).filter(isChildObj),
    },
  };
};

export interface MetaInputObj {
  topic?: string[];
  date?: string[];
  side?: string[];
  winner?: string[];
  opponent?: string[];
  members?: { _: string; $: { part: string } }[];
  note?: string[];
}
const isMetaInputObj = (v: unknown): v is MetaInputObj =>
  isObject<MetaInputObj>(v) &&
  (v.topic === undefined || arrayTypeof(v.topic, 'string')) &&
  (v.date === undefined || arrayTypeof(v.date, 'string')) &&
  (v.side === undefined || arrayTypeof(v.side, 'string')) &&
  (v.winner === undefined || arrayTypeof(v.winner, 'string')) &&
  (v.opponent === undefined || arrayTypeof(v.opponent, 'string')) &&
  (v.note === undefined || arrayTypeof(v.note, 'string')) &&
  (v.members === undefined ||
    (Array.isArray(v.members) &&
      v.members.every(
        (obj) =>
          isObject<{ _: string; $: { part: string } }>(obj) &&
          typeof obj['_'] === 'string' &&
          isObject<{ part: string }>(obj['$']) &&
          typeof obj['$'].part === 'string',
      )));

export interface MatchInputObj {
  $: {
    id: string;
  };
  $$?: SideInputObj[];
}
const isMatchInputObj = (v: unknown): v is MatchInputObj => {
  return (
    isObject<MatchInputObj>(v) &&
    (Array.isArray(v['$$']) || v['$$'] === undefined) &&
    isObject<MatchInputObj['$']>(v['$']) &&
    typeof v['$'].id === 'string'
  );
};
export interface decodeMatchInputObj {
  meta: MetaInputObj;
  match: MatchInputObj;
}
const is_decodeMatchInputObj = (v: unknown): v is decodeMatchInputObj => {
  return isObject<decodeMatchInputObj>(v) && isMetaInputObj(v.meta) && isMatchInputObj(v.match);
};

export const decodeMatch = (obj: object, idMap: idMap): decodeResult<mMatch> => {
  if (!is_decodeMatchInputObj(obj)) {
    console.log('not decodeMatchInputObj');
    return { id: undefined, idMap };
  }
  const generated = generate_match(undefined, {
    topic: obj.meta.topic?.at(-1),
    date: obj.meta.date?.at(-1),
    side: obj.meta.side?.at(-1),
    winner: obj.meta.winner?.at(-1),
    opponent: obj.meta.opponent?.at(-1),
    note: obj.meta.note?.at(-1),
    member: obj.meta.members ? map_to_object(obj.meta.members, (v) => ({ [v['$'].part]: v['_'] })) : undefined,
  });
  idMap.set(obj.match['$'].id, generated.id);
  if (Array.isArray(obj.match['$$']))
    idMap = obj.match['$$'].reduce((idMap, v) => decodeSide(v, generated.id, idMap).idMap, idMap);
  return { id: generated.id, idMap };
};
