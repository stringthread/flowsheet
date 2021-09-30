import {Point} from './Point';

export interface Part {
  name?: string|number;
  contents?: Array<Point>;
}
