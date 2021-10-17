import {mEvidence, generate_evidence} from './mEvidence'
import {isObject, multipleTypeof} from 'util/typeGuardUtils'
import {store} from 'stores';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_point_id} from 'stores/slices/id_generators';

export type Claim = string;

export type PointChild = Claim|mEvidence|mPoint;

export interface mPoint {
  id: string;
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<[string,boolean]>|Claim; // [PointChildのID,isPoint]かClaim単体
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) &&
    multipleTypeof(value.id, ['string']) &&
    multipleTypeof(value.numbering, ['undefined','number','string']) &&
    multipleTypeof(value.children_numbering, ['undefined','number','string']) &&
    ((value.contents instanceof Array || typeof value.contents === 'string')??true);
}

export const generate_point=(
  from?:Omit<mPoint,'id'|'contents'|'_shorthands'>
):mPoint=>{
  const generated: mPoint= {
    ...from,
    id: generate_point_id(),
  };
  store.dispatch(point_slice.actions.add(generated));
  return generated;
}

export const point_add_child=(parent_id:mPoint['id'], is_point: boolean)=>{
  const child=is_point?generate_point():generate_evidence();
  store.dispatch((is_point?point_slice:evidence_slice).actions.add(child));
  store.dispatch(point_slice.actions.addChild([parent_id,child.id,is_point]));
  return store.getState().point.entities[parent_id]??null;
};
