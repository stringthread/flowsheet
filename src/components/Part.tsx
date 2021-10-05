import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'stores/index';
import {Point} from './Point';
import {part_selectors} from 'stores/slices/part';

type Props = {
  partID: string;
};

export const Part: React.VFC<Props> = (props)=>{
  const part=useSelector((state:RootState)=>part_selectors.selectById(state,props.partID));
  if(part===undefined) return null;
  return (
    <div className="part" data-testid="part">
      <div className="partName">{part.name??''}</div>
      {part.contents?.map(
        content=><Point pointID={content} />
       )??null}
    </div>
  );
}
