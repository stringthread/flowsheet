import React,{useCallback} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {RootState} from 'stores/index';
import {mPoint} from 'models/mPoint';
import {Evidence} from './Evidence'
import {typeSelected} from './App';
import {point_selectors,point_slice} from 'stores/slices/point';
import {TextInput,TextArea} from './TextInput';

type Props = {
  pointID: string;
  setSelected: (_:typeSelected)=>void;
}

type ChildProps = {
  parentID:string;
  contents:mPoint['contents'];
  setSelected: (_:typeSelected)=>void;
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
      contents=>contents[1]?<Point pointID={contents[0]} setSelected={props.setSelected} />:<Evidence eviID={contents[0]} setSelected={props.setSelected} />
    )}
    </>
  );
}

export const Point: React.VFC<Props> = (props)=>{
  const dispatch=useDispatch();
  const point=useSelector((state:RootState)=>point_selectors.selectById(state,props.pointID));
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected([props.pointID,'point']);
  },[props.pointID,props.setSelected]);
  if(point===undefined) return null;
  return (
    <div className="point" data-testid="point" onClick={onClick}>
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
      {point.contents!==undefined?<PointChild parentID={props.pointID} contents={point.contents} setSelected={props.setSelected} />:null}
    </div>
  );
};
