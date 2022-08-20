import React,{useCallback} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {typeSelected} from './App';
import {claim_selectors, claim_slice} from 'stores/slices/claim';
import {StretchTextArea} from './TextInput';
import { mClaimId } from 'models/mClaim';
import { get_from_id } from 'services/id';

type Props = {
  claimID: mClaimId;
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
  const claim=get_from_id(props.claimID)?.obj;
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected(props.claimID);
  },[props.claimID,props.setSelected]);
  if(claim===undefined) return null;
  return (
    <StretchTextArea
      className="pointClaim"
      placeholder=" "
      value={claim.contents}
      onBlur={(e)=>{
        dispatch(claim_slice.actions.upsertOne({
          id_obj: props.claimID,
          contents: e.currentTarget.value,
        }));
      }}
      onClick={onClick}
      css={stylePointClaim}
    />
  );
};