import {isObject} from 'util/typeGuardUtils';
import {BaseModel, isModelId, ModelId, rawBaseModel} from './baseModel';
import {mSide, mSideId, rawSide} from './mSide';
import {mPart, rawPart} from './mPart';
import { PartiallyRequired } from 'util/utilityTypes';
import { get_from_id } from 'services/id';
import { store } from 'stores';
import { generate_match_id } from 'stores/ids/id_generators';
import { match_slice } from 'stores/slices/match';
import { EntityStateWithLastID } from 'stores/slices/EntityStateWithLastID';

export const match_id_prefix='match_';
export type mMatchId = ModelId<typeof match_id_prefix>;
export const is_mMatchId=(v:unknown): v is mMatchId => isModelId(v) && v.prefix===match_id_prefix;
export const to_mMatchId=(seed:string): mMatchId => ({
  id: match_id_prefix + seed,
  prefix: match_id_prefix
});

export interface rawMatch extends rawBaseModel {
  id: mMatchId;
  topic?: string;
  date?: Date|string;
  side?: rawSide['side'];
  winner?: string;
  opponent?: string;
  member?: Map<rawPart['name'],string>; // パート名からメンバ名への対応
  note?: string;
  contents?: Array<mSideId>;
}

export class mMatch extends BaseModel<rawMatch, undefined, mSide> {
  override generate(from:Partial<rawMatch>): mMatch{
    const generated: rawMatch= {
      ...from,
      id: generate_match_id(),
    };
    this.id=generated.id;
    store.dispatch(this.getSlice().actions.add(generated));
    return this;
  }
  override getSlice() { return match_slice; }
  override getStore(): EntityStateWithLastID<rawMatch> {
    return store.getState().match;
  };
  addChild: (child?: mSide) => (mSide|undefined) = (child)=>{
    if(child===undefined) return new mSide({parent: this.id});
    store.dispatch(this.getSlice().actions.addChild([this.id, child?.id]));
    return child;
  };
}
