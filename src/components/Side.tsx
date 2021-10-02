import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'stores/index';
import {Part} from './Part';
import {side_selectors} from 'stores/slices/side';

type Props = {
  sideID: string;
}

export const Side: React.VFC<Props> = (props)=>{
  const side=useSelector((state:RootState)=>side_selectors.selectById(state,props.sideID));
  if(side===undefined) return null;
  return (
    <div className="side">
      <div className="sideName">{side.side}</div>
      {side.contents?.map(content=><Part partID={content} />)??null}
    </div>
  );
};
