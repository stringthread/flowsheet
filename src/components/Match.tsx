import React from 'react';
import {mMatch} from '~/models/mMatch'
import {Part} from './Part';

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
  match: mMatch;
}

export const Match: React.VFC<Props> = (props)=>(
  <div className='match'>
    <MatchHeader metadata={props.match} />
    {props.match.content?.map(part=>(<Part part={part} />))??null}
  </div>
);
