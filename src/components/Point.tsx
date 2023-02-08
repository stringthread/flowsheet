import { AppContext, typeSelected } from './App';
import { Claim } from './Claim';
import { Evidence } from './Evidence';
import { StretchTextInput, StretchTextArea } from './TextInput';
import { css } from '@emotion/react';
import LeaderLine from 'leader-line-new';
import { id_is_mClaim } from 'models/mClaim';
import { id_is_mEvidence } from 'models/mEvidence';
import { id_is_mPoint, mPoint } from 'models/mPoint';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { set_rebut } from 'services/point';
import { toastAndLog } from 'services/toast';
import { RootState } from 'stores/index';
import { point_selectors, point_slice } from 'stores/slices/point';
import { useCheckDepsUpdate, useDependentObj } from 'util/hooks';

type Props = {
  pointID: mPoint['id'];
  setSelected: (_: typeSelected) => void;
};

type ChildProps = {
  parentID: mPoint['id'];
  contents: mPoint['contents'];
  setSelected: (_: typeSelected) => void;
};

const stylePointClaim = css`
  box-sizing: content-box;
  width: 100%;
  height: 1em;
  border: none !important;
`;

const PointChild: React.VFC<ChildProps> = (props) => {
  return (
    <>
      {props.contents?.map((id) => {
        if (id_is_mEvidence(id)) return <Evidence eviID={id} setSelected={props.setSelected} />;
        if (id_is_mClaim(id)) return <Claim claimID={id} setSelected={props.setSelected} />;
        if (id_is_mPoint(id)) return <Point pointID={id} setSelected={props.setSelected} />;
        return null;
      })}
    </>
  );
};

const stylePointNumbering = css`
  display: inline-block;
  min-width: 1em;
  width: 1em;
  height: 1em;
  flex-grow: 0;
  flex-shrink: 0;
  &:not(:placeholder-shown):not(:focus) {
    padding-right: 0;
    padding-left: 0;
    border: none;
  }
`;

const stylePointChildrenWrap = css`
  min-width: 0;
`;

const stylePoint = css`
  width: 100%;
  display: flex;
  column-gap: 0;
`;

export const Point: React.VFC<Props> = (props) => {
  const dispatch = useDispatch();
  const point = useSelector((state: RootState) => point_selectors.selectById(state, props.pointID));
  const onFocus = useCallback(
    (e: React.FocusEvent) => {
      e.preventDefault();
      e.stopPropagation();
      props.setSelected(props.pointID);
    },
    [props.pointID, props.setSelected],
  );
  const context = useContext(AppContext);
  const onClick = context?.Callbacks.Point?.onClick;
  const idToPointRef = context?.Refs.idToPointRef;
  const thisRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (context?.Refs.nextFocus.get !== props.pointID) return;
    focusRef.current?.focus();
    context?.Refs.nextFocus.set(undefined);
  });
  if (useCheckDepsUpdate([props.pointID, thisRef])) idToPointRef?.add({ [props.pointID]: thisRef });
  const [rebuttalLine, setRebuttalLine] = useState<LeaderLine | undefined>(undefined);
  useEffect(() => {
    if (idToPointRef) {
      if (rebuttalLine !== undefined) {
        rebuttalLine.remove();
        setRebuttalLine(undefined);
      }
      if (point?.rebut_to !== undefined) {
        try {
          const rebut_to = idToPointRef.get[point.rebut_to]?.current;
          if (rebut_to && thisRef.current) setRebuttalLine(new LeaderLine(rebut_to, thisRef.current));
        } catch (e) {
          set_rebut(props.pointID, undefined);
          toastAndLog('リンク線の表示に失敗', '反駁先が正しくありません');
        }
      }
    }
  }, [point?.rebut_to, setRebuttalLine, idToPointRef, idToPointRef?.get]);
  if (point === undefined) return null;
  return (
    <div
      ref={thisRef}
      className='point'
      data-testid='point'
      data-modelid={props.pointID}
      onFocus={onFocus}
      onClick={onClick}
      css={stylePoint}
    >
      <StretchTextInput
        ref={focusRef}
        key={props.pointID}
        className='pointNumbering'
        data-testid='pointNumbering'
        value={point.numbering?.toString()}
        onBlur={(e) => {
          dispatch(
            point_slice.actions.upsertOne({
              id: props.pointID,
              numbering: e.currentTarget.value,
            }),
          );
        }}
        css={stylePointNumbering}
      />
      <div className='pointChildrenWrap' data-testid='pointChildrenWrap' css={stylePointChildrenWrap}>
        {point.contents !== undefined ? (
          <PointChild parentID={props.pointID} contents={point.contents} setSelected={props.setSelected} />
        ) : null}
      </div>
    </div>
  );
};
