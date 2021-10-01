import React from 'react';
import {mSide} from 'models/mSide'
import {Part} from './Part';

type Props = {
  side: mSide;
}

export const Side: React.VFC<Props> = (props)=>(
  <div className="side">
    <div className="sideName">{props.side.side}</div>
    {props.side.content?.map(content=><Part part={content} />)??null}
  </div>
);
