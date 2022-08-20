import React,{useCallback} from 'react';
import {useSelector} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {Part} from './Part';
import {typeSelected} from './App';
import {side_selectors} from 'stores/slices/side';
import { mSideId } from 'models/mSide';
import { get_from_id } from 'services/id';

type Props = {
  sideID: mSideId;
  setSelected: (_:typeSelected)=>void;
}

const styleSide=css``;
const styleSideName=css``;
const styleSideChildrenWrap=css`
  width: 100%;
  min-height: 20em;
  display: flex;
  gap: 1em;
  justify-content: space-between;
  &>*{
    width: 100%; /* 子要素を強制的に均等幅にする */
  }
`;

export const Side: React.VFC<Props> = (props)=>{
  const side=get_from_id(props.sideID)?.obj;
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected(props.sideID);
  },[props.sideID,props.setSelected]);
  if(side===undefined) return null;
  return (
    <div className="side" data-testid='side' onClick={onClick} css={styleSide}>
      <div className="sideName" css={styleSideName}>{side.side}</div>
      <div className="sideChildrenWrap" css={styleSideChildrenWrap}>
        {side.contents?.map(content=><Part partID={content} setSelected={props.setSelected} />)??null}
      </div>
    </div>
  );
};
