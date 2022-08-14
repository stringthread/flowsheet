import React,{useCallback} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {is_mPointId, mPoint, mPointId} from 'models/mPoint';
import {Evidence} from './Evidence'
import {Claim} from './Claim';
import {typeSelected} from './App';
import {point_selectors,point_slice} from 'stores/slices/point';
import {StretchTextInput,StretchTextArea} from './TextInput';
import { is_mClaimId } from 'models/mClaim';
import { is_mEvidenceId } from 'models/mEvidence';

type Props = {
  pointID: mPointId;
  setSelected: (_:typeSelected)=>void;
}

type ChildProps = {
  parentID:mPointId;
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
  return (
    <>
    {props.contents?.map(
      id=>{
        if(is_mEvidenceId(id)) return <Evidence eviID={id} setSelected={props.setSelected} />;
        if(is_mClaimId(id)) return <Claim claimID={id} setSelected={props.setSelected} />;
        if(is_mPointId(id)) return <Point pointID={id} setSelected={props.setSelected} />;
        return null;
      }
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
    props.setSelected(props.pointID);
  },[props.pointID,props.setSelected]);
  if(point===undefined) return null;
  return (
    <div className="point" data-testid="point" onClick={onClick} css={stylePoint}>
      {<StretchTextInput
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
