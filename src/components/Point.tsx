import React from 'react';
import {is_mEvidence} from '~/models/mEvidence'
import {mPoint, is_mPoint} from '~/models/mPoint';
import {Evidence} from './Evidence'

type Props = {
  point: mPoint;
}

export const Point: React.VFC<Props> = (props)=>(
  <div className="point">
    <span className="pointNumbering">{props.point.numbering}</span>
    {props.point.contents?.map(
      content=>{
        if(is_mEvidence(content)) return <Evidence evi={content} />;
        if(is_mPoint(content)) return <Point point={content} />;
        return <div className="pointClaim">{content}</div>;
      }
    )??null}
  </div>
);
