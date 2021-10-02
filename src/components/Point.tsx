import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'stores/index';
import {mPoint} from 'models/mPoint';
import {Evidence} from './Evidence'
import {point_selectors} from 'stores/slices/point';
import {ValueOf} from 'util/utilityTypes';

type Props = {
  pointID: string;
}

const PointChild: React.VFC<{contents:ValueOf<mPoint['contents']>}> = (props)=>{
  if(typeof props.contents === 'string') return <div className="pointClaim">{props.contents}</div>;
  return (
    <>
    {props.contents?.map(
      contents=>contents[1]?<Point pointID={contents[0]} />:<Evidence eviID={contents[0]} />
    )}
    </>
  );
}

export const Point: React.VFC<Props> = (props)=>{
  const point=useSelector((state:RootState)=>point_selectors.selectById(state,props.pointID));
  if(point===undefined) return null;
  return (
    <div className="point">
      <span className="pointNumbering">{point.numbering}</span>
      {point.contents!==undefined?<PointChild contents={point.contents} />:null}
    </div>
  );
};
