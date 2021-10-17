import React,{useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'stores/index';
import {mMatch} from 'models/mMatch';
import {typeSelected} from './App';
import {Side} from './Side';
import { match_selectors } from 'stores/slices/match';

type HeaderProps = {
  metadata: Omit<mMatch,'content'>
};

const MatchHeader: React.VFC<HeaderProps> = (props)=>(
  <div className="matchHeader" data-testid="matchHeader">
    <div className="matchTopic">{props.metadata.topic}</div>
    <div className="matchDate">{props.metadata.date}</div>
  </div>
);

type Props = {
  matchID: string;
  setSelected: (_:typeSelected)=>void;
}

export const Match: React.VFC<Props> = (props)=>{
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected([props.matchID,'match']);
  },[props.matchID,props.setSelected]);
  const match=useSelector((state:RootState)=>match_selectors.selectById(state,props.matchID));
  if(match===undefined) return null;
  return (
    <div className='match' data-testid="match" onClick={onClick}>
      <MatchHeader metadata={match} />
      {match.contents?.map(side=>(<Side sideID={side} setSelected={props.setSelected} />))??null}
    </div>
  );
}
