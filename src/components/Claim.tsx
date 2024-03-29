import { AppContext, typeSelected } from './App';
import { StretchTextArea } from './TextInput';
import { css } from '@emotion/react';
import { mClaim } from 'models/mClaim';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'stores/index';
import { claim_selectors, claim_slice } from 'stores/slices/claim';

type Props = {
  claimID: mClaim['id'];
  setSelected: (_: typeSelected) => void;
};

const stylePointClaim = css`
  box-sizing: content-box;
  width: 100%;
  height: 1em;
  border: none !important;
  &:not(:only-child):not(:last-child):placeholder-shown {
    background: #f6f6f6;
  }
`;

export const Claim: React.VFC<Props> = (props) => {
  const dispatch = useDispatch();
  const claim = useSelector((state: RootState) => claim_selectors.selectById(state, props.claimID));
  const context = useContext(AppContext);
  const focusRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (context?.Refs.nextFocus.get !== props.claimID) return;
    focusRef.current?.focus();
    context?.Refs.nextFocus.set(undefined);
  });
  const onFocus = useCallback(
    (e: React.FocusEvent) => {
      e.preventDefault();
      e.stopPropagation();
      props.setSelected(props.claimID);
    },
    [props.claimID, props.setSelected],
  );
  if (claim === undefined) return null;
  return (
    <StretchTextArea
      ref={focusRef}
      key={props.claimID}
      className='pointClaim'
      data-testid='claim'
      data-modelid={props.claimID}
      placeholder=' '
      value={claim.contents}
      onBlur={(e) => {
        dispatch(
          claim_slice.actions.upsertOne({
            id: props.claimID,
            contents: e.currentTarget.value,
          }),
        );
      }}
      onFocus={onFocus}
      css={stylePointClaim}
    />
  );
};
