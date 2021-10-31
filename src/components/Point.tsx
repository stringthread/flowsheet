import React,{useCallback} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {mPoint, is_Claim} from 'models/mPoint';
import {Evidence} from './Evidence'
import {typeSelected} from './App';
import {point_selectors,point_slice} from 'stores/slices/point';
import {StretchTextInput,StretchTextArea} from './TextInput';

type Props = {
  pointID: string;
  setSelected: (_:typeSelected)=>void;
}

type ChildProps = {
  parentID:string;
  contents:mPoint['contents'];
  setSelected: (_:typeSelected)=>void;
};

const stylePointClaim=css`
  box-sizing: content-box;
  width: 100%;
  height: 1em;
  border: none !important;
`;

const PointChild: React.VFC<ChildProps> = (props)=>{
  const dispatch=useDispatch();
  if(is_Claim(props.contents)){
    return (
      <StretchTextArea
        className="pointClaim"
        placeholder=" "
        value={props.contents}
        onBlur={(e)=>{
          dispatch(point_slice.actions.upsertOne({
            id: props.parentID,
            contents: e.currentTarget.value,
          }));
        }}
        css={stylePointClaim}
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

const stylePointNumbering=css`
  display: inline-block;
  min-width: 1em;
  width: 1em;
  height: 1em;
  flex-grow: 0;
  flex-shrink: 0;
  &:not(:placeholder-shown):not(:focus){
    padding-right: 0;
    padding-left: 0;
    border: none;
  }
`;

const stylePointChildrenWrap=css`
  min-width: 0;
`;

const stylePoint=css`
  width: 100%;
  display: flex;
  column-gap: 0;
`;

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
    <div className="point" data-testid="point" onClick={onClick} css={stylePoint}>
      {is_Claim(point.contents)?null:
        <StretchTextInput
          className="pointNumbering"
          data-testid="pointNumbering"
          value={point.numbering?.toString()}
          onBlur={(e)=>{
            dispatch(point_slice.actions.upsertOne({
              id: props.pointID,
              numbering: e.currentTarget.value,
            }));
          }}
          css={stylePointNumbering}
        />
      }
      <div className="pointChildrenWrap" data-testid="pointChildrenWrap" css={stylePointChildrenWrap}>
        {point.contents!==undefined?<PointChild parentID={props.pointID} contents={point.contents} setSelected={props.setSelected} />:null}
      </div>
    </div>
  );
};
