import React,{useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {mPoint} from 'models/mPoint';
import {Evidence} from './Evidence'
import {Claim} from './Claim';
import {AppContext, typeSelected} from './App';
import {point_selectors,point_slice} from 'stores/slices/point';
import {id_is_mEvidence, id_is_mClaim, id_is_mPoint} from 'services/id';
import {StretchTextInput,StretchTextArea} from './TextInput';
import LeaderLine from 'leader-line-new';
import { useCheckDepsUpdate, useDependentObj } from 'util/hooks';

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
  return (
    <>
    {props.contents?.map(
      id=>{
        if(id_is_mEvidence(id)) return <Evidence eviID={id} setSelected={props.setSelected} />;
        if(id_is_mClaim(id)) return <Claim claimID={id} setSelected={props.setSelected} />;
        if(id_is_mPoint(id)) return <Point pointID={id} setSelected={props.setSelected} />;
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
  const onFocus=useCallback((e: React.FocusEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected(props.pointID);
  },[props.pointID,props.setSelected]);
  const onClick = useContext(AppContext)?.Callbacks.Point?.onClick;
  const idToPointRef = useContext(AppContext)?.Refs.idToPointRef;
  const thisRef = useRef<HTMLDivElement>(null);
  if(useCheckDepsUpdate([props.pointID, thisRef])) idToPointRef?.add({ [props.pointID]: thisRef, });
  const [rebuttalLine, setRebuttalLine] = useState<LeaderLine|undefined>(undefined);
  useEffect(()=>{
    if(idToPointRef){
      if(rebuttalLine!==undefined){
        rebuttalLine.remove();
        setRebuttalLine(undefined);
      }
      if(point?.rebut_to!==undefined){
        const ref_to_rebut = idToPointRef.get[point.rebut_to];
        if(ref_to_rebut!==undefined && ref_to_rebut.current!==null && thisRef.current) setRebuttalLine(new LeaderLine(ref_to_rebut.current, thisRef.current));
      }
    }
  },[point?.rebut_to, setRebuttalLine, idToPointRef, idToPointRef?.get]);
  if(point===undefined) return null;
  return (
    <div ref={thisRef} className="point" data-testid="point" data-modelid={props.pointID} onFocus={onFocus} onClick={onClick} css={stylePoint}>
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
      <span>{point.rebut_to??'-'}</span>
      <div className="pointChildrenWrap" data-testid="pointChildrenWrap" css={stylePointChildrenWrap}>
        {point.contents!==undefined?<PointChild parentID={props.pointID} contents={point.contents} setSelected={props.setSelected} />:null}
      </div>
    </div>
  );
};
