import React,{useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'stores/index';
import {Part} from './Part';
import {typeSelected} from './App';
import {side_selectors} from 'stores/slices/side';

type Props = {
  sideID: string;
  setSelected: (_:typeSelected)=>void;
}

export const Side: React.VFC<Props> = (props)=>{
  const side=useSelector((state:RootState)=>side_selectors.selectById(state,props.sideID));
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected([props.sideID,'side']);
  },[props.sideID,props.setSelected]);
  if(side===undefined) return null;
  return (
    <div className="side" data-testid='side' onClick={onClick}>
      <div className="sideName">{side.side}</div>
      {side.contents?.map(content=><Part partID={content} setSelected={props.setSelected} />)??null}
    </div>
  );
};
