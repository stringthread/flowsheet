import React from 'react';
import {mPart} from '~/models/mPart';
import {Point} from './Point'

type Props = {
  part: mPart;
};

export const Part: React.VFC<Props> = (props)=>(
  <div className="part">
    <div className="partName">{props.part.name??''}</div>
    {props.part.contents?.map(
      content=><Point point={content} />
     )??null}
  </div>
);
