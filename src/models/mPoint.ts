import {mEvidence} from './mEvidence'
import {isObject, multipleTypeof} from 'util/typeGuardUtils'
import {store} from 'stores';
import {point_slice} from 'stores/slices/point';
import {generate_point_id} from 'stores/slices/id_generators';

export type Claim = string;

export type PointChild = Claim|mEvidence|mPoint;

export interface mPoint {
  id: string;
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<[string,boolean]>|Claim; // [PointChildのID,isPoint]かClaim単体
  _shorthands?: Map<string,number>; // _contentsのキーに変換
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) &&
    multipleTypeof(value.id, ['string']) &&
    multipleTypeof(value.numbering, ['undefined','number','string']) &&
    multipleTypeof(value.children_numbering, ['undefined','number','string']) &&
    ((value.contents instanceof Array || typeof value.contents === 'string')??true) &&
    ((value._shorthands instanceof Map)??true);
}

export const generate_point=(
  from?:Omit<mPoint,'id'|'contents'|'_shorthands'>
):mPoint=>{
  const generated: mPoint= {
    ...from,
    id: generate_point_id(),
    _shorthands: new Map<string,number>(),
  };
  store.dispatch(point_slice.actions.add(generated));
  return generated;
}
