import {baseModel} from './baseModel';
import {mEvidence, generate_evidence} from './mEvidence';
import {isObject, multipleTypeof} from 'util/typeGuardUtils';
import {store} from 'stores';
import {point_slice} from 'stores/slices/point';
import {evidence_slice} from 'stores/slices/evidence';
import {generate_point_id} from 'stores/slices/id_generators';

export type Claim = string;

export const is_Claim=(value:unknown): value is Claim=>{
  return typeof value=='string';
}

export type PointChild = Claim|mEvidence|mPoint;

const mPointSymbol=Symbol('mPoint');

export interface mPoint extends baseModel {
  typesigniture: typeof mPointSymbol,
  parent: baseModel['id'];
  numbering?: number|string;
  children_numbering?: number|string;
  contents?: Array<[string,boolean]>|Claim; // [PointChildのID,isPoint]かClaim単体
}

export const is_mPoint = (value: unknown): value is mPoint => {
  return isObject<mPoint>(value) && value.typesigniture==mPointSymbol;
}

export const generate_point=(
  parent: baseModel['id'],
  from?:Omit<mPoint,'typesigniture'|'id'|'parent'|'contents'|'_shorthands'>
):mPoint=>{
  const generated: mPoint= {
    ...from,
    typesigniture: mPointSymbol,
    id: generate_point_id(),
    parent
  };
  store.dispatch(point_slice.actions.add(generated));
  return generated;
}

export const point_add_child=(parent_id:mPoint['id'], is_point: boolean): mPoint|mEvidence=>{
  let child: mPoint|mEvidence;
  if(is_point) {
    child=generate_point(parent_id);
    store.dispatch(point_slice.actions.add(child));
  } else {
    child=generate_evidence(parent_id);
    store.dispatch(evidence_slice.actions.add(child));
  }
  store.dispatch(point_slice.actions.addChild([parent_id,child.id,is_point]));
  return child;
};
