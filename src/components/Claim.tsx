import React,{useCallback} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {typeSelected} from './App';
import {claim_selectors, claim_slice} from 'stores/slices/claim';
import {StretchTextArea} from './TextInput';

type Props = {
  claimID: string;
  setSelected: (_:typeSelected)=>void;
};

const stylePointClaim=css`
  box-sizing: content-box;
  width: 100%;
  height: 1em;
  border: none !important;
`;

export const Claim: React.VFC<Props> = (props)=>{
  const dispatch=useDispatch();
  const claim=useSelector((state:RootState)=>claim_selectors.selectById(state,props.claimID));
  const onFocus=useCallback((e: React.FocusEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected(props.claimID);
  },[props.claimID,props.setSelected]);
  if(claim===undefined) return null;
  return (
    <StretchTextArea
      className="pointClaim"
      data-modelid={props.claimID}
      placeholder=" "
      value={claim.contents}
      onBlur={(e)=>{
        dispatch(claim_slice.actions.upsertOne({
          id: props.claimID,
          contents: e.currentTarget.value,
        }));
      }}
      onFocus={onFocus}
      css={stylePointClaim}
    />
  );
};