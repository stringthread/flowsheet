import {Unit} from './Unit';

export interface Issue {
  signpost?: string|number;
  contents?: Array<Unit>;
}
