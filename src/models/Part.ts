import {Issue} from './Issue';

export interface Part {
  name?: string|number;
  contents?: Array<Issue>;
}
