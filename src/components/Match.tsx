import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'stores/index';
import {mMatch} from 'models/mMatch';
import {Side} from './Side';
import { match_selectors } from 'stores/slices/match';

type HeaderProps = {
  metadata: Omit<mMatch,'content'>
};

const MatchHeader: React.VFC<HeaderProps> = (props)=>(
  <div className="matchHeader">
    <div className="matchTopic">{props.metadata.topic}</div>
    <div className="matchDate">{props.metadata.date}</div>
  </div>
);

type Props = {
  matchID: string;
}

export const Match: React.VFC<Props> = (props)=>{
  const match=useSelector((state:RootState)=>match_selectors.selectById(state,props.matchID));
  if(match===undefined) return null;
  return (
    <div className='match'>
      <MatchHeader metadata={match} />
      {match.contents?.map(side=>(<Side sideID={side} />))??null}
    </div>
  );
}
