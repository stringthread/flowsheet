import React,{useCallback} from 'react';
import {useSelector} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {mMatch, mMatchId, rawMatch} from 'models/mMatch';
import {typeSelected} from './App';
import {Side} from './Side';
import { match_selectors } from 'stores/slices/match';
import { get_from_id } from 'services/id';

type HeaderProps = {
  metadata: Omit<rawMatch,'content'>
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
  matchID: mMatchId;
  setSelected: (_:typeSelected)=>void;
}

const styleMatch=css`
  &,& *{
    box-sizing: border-box;
  }
`;

export const Match: React.VFC<Props> = (props)=>{
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected(props.matchID);
  },[props.matchID,props.setSelected]);
  return (
    <div className='match' data-testid="match" onClick={onClick} css={styleMatch}>
      <MatchHeader metadata={get_from_id(props.matchID)?.obj??{ id_obj: props.matchID, id: props.matchID.id }} />
      {get_from_id(props.matchID)?.obj?.contents?.map(side=>(<Side sideID={side} setSelected={props.setSelected} />))??null}
    </div>
  );
}
