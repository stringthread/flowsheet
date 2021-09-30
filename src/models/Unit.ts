import {Point} from './Point';

export interface Unit {
  signpost?: string|number; // 'inh', '解決性'など。numberなら外部でマッピングを定義
  contents?: Array<Point>;
}
