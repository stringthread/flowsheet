import React,{useCallback} from 'react';
import {useSelector} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {mMatch} from 'models/mMatch';
import {typeSelected} from './App';
import {Side} from './Side';
import { match_selectors } from 'stores/slices/match';

type HeaderProps = {
  metadata: Omit<mMatch,'content'>
};

const styleMatchHeader=css`
  width: 100%;
  padding: 0.5em;
  border: solid 1px black;
  &>span{
    margin: 0 0.5em;
    &:first-of-type{
      margin-left: 0;
    }
    &:empty{
      margin: 0;
    }
  }
`;

const MatchHeader: React.VFC<HeaderProps> = (props)=>(
  <div className="matchHeader" data-testid="matchHeader" css={styleMatchHeader}>
    <span className="matchTopic">{props.metadata.topic}</span>
    <span className="matchDate">{props.metadata.date}</span>
  </div>
);

type Props = {
  matchID: mMatch['id'];
  setSelected: (_:typeSelected)=>void;
}

const styleMatch=css`
  &,& *{
    box-sizing: border-box;
  }
`;

export const Match: React.VFC<Props> = (props)=>{
  const onFocus=useCallback((e: React.FocusEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected(props.matchID);
  },[props.matchID,props.setSelected]);
  const match=useSelector((state:RootState)=>match_selectors.selectById(state,props.matchID));
  if(match===undefined) return null;
  return (
    <div className='match' data-testid="match" data-modelid={props.matchID} onFocus={onFocus} css={styleMatch}>
      <MatchHeader metadata={match} />
      {match.contents?.map(side=>(<Side sideID={side} setSelected={props.setSelected} />))??null}
    </div>
  );
}
