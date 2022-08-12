import {isObject} from 'util/typeGuardUtils';
import {baseModel} from './baseModel';

export const mPartSymbol='mPart';

export interface mPart extends baseModel {
  typesigniture: typeof mPartSymbol,
  parent: baseModel['id'];
  name?: string|number;
  contents?: Array<baseModel['id']>; // mPointのID
}

export const is_mPart=(value: unknown): value is mPart =>{
  return isObject<mPart>(value) && value.typesigniture==mPartSymbol;
};
