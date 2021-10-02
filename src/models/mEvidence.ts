import {isObject, multipleTypeof} from 'util/typeGuardUtils'

export interface mEvidence {
  id?: string;
  about_author?: string;
  author?: string;
  year?: number|string;
  content?: string;
}

export const is_mEvidence = (value: unknown): value is mEvidence => {
  return isObject<mEvidence>(value) &&
    multipleTypeof(value.id, ['undefined','string']) &&
    multipleTypeof(value.about_author, ['undefined','string']) &&
    multipleTypeof(value.author, ['undefined','string']) &&
    multipleTypeof(value.year, ['undefined','number','string']) &&
    multipleTypeof(value.content, ['undefined','string']);
}
