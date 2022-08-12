import React,{useCallback} from 'react';
import {useSelector} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {Point} from './Point';
import {typeSelected} from './App';
import {part_selectors} from 'stores/slices/part';

type Props = {
  partID: string;
  setSelected: (_:typeSelected)=>void;
};

const stylePartName=css`
  border-bottom: solid 1px black;
  padding: 0.5em;
  font-weight: bold;
`;
const stylePartChildrenWrap=css`
  padding: 6px;
  padding-top: 0.5em;
`;
const stylePart=css`
  border: solid 1px black;
`;

export const Part: React.VFC<Props> = (props)=>{
  const part=useSelector((state:RootState)=>part_selectors.selectById(state,props.partID));
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected(props.partID);
  },[props.partID,props.setSelected]);
  if(part===undefined) return null;
  return (
    <div className="part" data-testid="part" onClick={onClick} css={stylePart}>
      <div className="partName" css={stylePartName}>{part.name??''}</div>
      <div className="partChildrenWrap" css={stylePartChildrenWrap}>
        {part.contents?.map(
          content=><Point pointID={content} setSelected={props.setSelected} />
         )??null}
       </div>
    </div>
  );
}
