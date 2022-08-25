import { is_mMatch, mMatch } from "models/mMatch";
import { get_from_id } from "services/id";
import { map_object } from "util/funcs";
import { encodeSide, SideOutputObj } from "./side";

export interface MatchOutputObj {
  meta: {
    topic?: mMatch['topic'];
    date?: mMatch['date'];
    side?: mMatch['side'];
    winner?: mMatch['winner'];
    opponent?: mMatch['opponent'];
    members?: {
      '@part': string|number;
      _: string;
    }[];
    note?: mMatch['note'];
  };
  match?: SideOutputObj[];
};

const isChildObj = (v: SideOutputObj|undefined) : v is SideOutputObj => v!==undefined;
export const encodeMatch = (id: mMatch['id']): MatchOutputObj|undefined => {
  const model = get_from_id(id);
  if(!is_mMatch(model)) return undefined;
  return {
    meta: {
      topic: model['topic'],
      date: model['date'],
      side: model['side'],
      winner: model['winner'],
      opponent: model['opponent'],
      members: model['member']?map_object(model['member'], (v, k)=>({ '@part': k , _: v })):[],
      note: model['note'],
    },
    match: model.contents?.map(encodeSide).filter(isChildObj),
  };
}
