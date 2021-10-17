import React,{useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'stores/index';
import {Point} from './Point';
import {typeSelected} from './App';
import {part_selectors} from 'stores/slices/part';

type Props = {
  partID: string;
  setSelected: (_:typeSelected)=>void;
};

export const Part: React.VFC<Props> = (props)=>{
  const part=useSelector((state:RootState)=>part_selectors.selectById(state,props.partID));
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected([props.partID,'part']);
  },[props.partID,props.setSelected]);
  if(part===undefined) return null;
  return (
    <div className="part" data-testid="part" onClick={onClick}>
      <div className="partName">{part.name??''}</div>
      {part.contents?.map(
        content=><Point pointID={content} setSelected={props.setSelected} />
       )??null}
    </div>
  );
}
