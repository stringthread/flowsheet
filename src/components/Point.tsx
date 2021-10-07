import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {RootState} from 'stores/index';
import {mPoint} from 'models/mPoint';
import {Evidence} from './Evidence'
import {point_selectors,point_slice} from 'stores/slices/point';
import {TextInput,TextArea} from './TextInput';

type Props = {
  pointID: string;
}

type ChildProps = {
  parentID:string;
  contents:mPoint['contents'];
};

const PointChild: React.VFC<ChildProps> = (props)=>{
  const dispatch=useDispatch();
  if(typeof props.contents === 'string'){
    return (
      <TextArea
        className="pointClaim"
        value={props.contents}
        onBlur={(e)=>{
          dispatch(point_slice.actions.upsertOne({
            id: props.parentID,
            contents: e.currentTarget.value,
          }));
        }}
      />
    );
  }
  return (
    <>
    {props.contents?.map(
      contents=>contents[1]?<Point pointID={contents[0]} />:<Evidence eviID={contents[0]} />
    )}
    </>
  );
}

export const Point: React.VFC<Props> = (props)=>{
  const dispatch=useDispatch();
  const point=useSelector((state:RootState)=>point_selectors.selectById(state,props.pointID));
  if(point===undefined) return null;
  return (
    <div className="point" data-testid="point">
      <TextInput
        className="pointNumbering"
        data-testid="pointNumbering"
        value={point.numbering?.toString()}
        onBlur={(e)=>{
          dispatch(point_slice.actions.upsertOne({
            id: props.pointID,
            numbering: e.currentTarget.value,
          }));
        }}
      />
      {point.contents!==undefined?<PointChild parentID={props.pointID} contents={point.contents} />:null}
    </div>
  );
};
