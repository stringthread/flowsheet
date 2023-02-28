import { ErrorBoundary } from './ErrorBoundary';
import { useHelpModal } from './HelpModal';
import { useLoadFileModal } from './LoadFileModal';
import { Match } from './Match';
import { MenuBar } from './MenuBar';
import { Point } from './Point';
import { useToolBar } from './ToolBar';
import { useTutorialModal } from './TutorialModal';
import { css } from '@emotion/react';
import LeaderLine from 'leader-line-new';
import { ID_TYPE } from 'models';
import { baseModel } from 'models/baseModel';
import { mEvidenceSignature } from 'models/mEvidence';
import { mMatch } from 'models/mMatch';
import { id_is_mPoint, id_is_PointChild, mPoint } from 'models/mPoint';
import React, { useState, useLayoutEffect, useCallback, useContext, createContext, useRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { saveMatch } from 'repositories/encoder';
import { append_claim } from 'services/claim';
import { append_evidence } from 'services/evidence';
import { get_from_id } from 'services/id';
import { createLeaderLine } from 'services/line';
import { generate_match } from 'services/match';
import {
  append_sibling_point,
  append_point_child,
  append_point_to_part,
  set_rebut_to,
  append_point_to_parent,
  is_switch_for_append_id,
} from 'services/point';
import { toastAndLog } from 'services/toast';
import { store } from 'stores/index';
import { point_slice } from 'stores/slices/point';
import { useCheckDepsUpdate, useDependentObj, usePreviousValue } from 'util/hooks';

export type typeSelected = ID_TYPE | undefined;

type idToPointRef = { [id: mPoint['id']]: React.RefObject<HTMLElement> };

export type AppContext = {
  Callbacks: {
    Point?: {
      onClick: ((e: React.SyntheticEvent<HTMLElement>) => void) | undefined;
    };
  };
  Refs: {
    idToPointRef: { get: idToPointRef; add: (_: idToPointRef) => void };
    nextFocus: { get: baseModel['id'] | undefined; set: (v: baseModel['id'] | undefined) => void };
  };
};
export const AppContext = createContext<AppContext | undefined>(undefined);

type rebutToFnInfo = [ReturnType<typeof set_rebut_to>, HTMLElement | null] | undefined;
const useOnClickToRebut = (
  idToPointRef: idToPointRef,
  rebutToFnInfo: rebutToFnInfo,
  setRebutToFn: React.Dispatch<React.SetStateAction<rebutToFnInfo>>,
  setLineStartId: React.Dispatch<React.SetStateAction<typeSelected>>,
) => {
  const stop = useCallback(() => {
    setLineStartId(undefined);
    setRebutToFn(undefined);
  }, [setRebutToFn]);
  const onClick = useCallback(
    (e: React.SyntheticEvent<HTMLElement>) => {
      if (rebutToFnInfo === undefined) return;
      const [rebutToFn, previousActive] = rebutToFnInfo;
      const data_modelid = e.currentTarget.getAttribute('data-modelid');
      if (typeof data_modelid !== 'string' || !id_is_mPoint(data_modelid)) {
        toastAndLog(
          '反駁先の指定',
          'Point, Claim, Evidenceを指定してください',
          `invalid data_modelid: ${data_modelid}`,
        );
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      if (e.target instanceof HTMLElement) e.target.blur();
      rebutToFn(data_modelid);
      stop();
      if (previousActive !== null) previousActive.focus();
    },
    [idToPointRef, rebutToFnInfo, stop],
  );
  return { onClick, stop };
};

const useAppEventListeners = (
  selected: typeSelected,
  setRebutToFn: React.Dispatch<React.SetStateAction<rebutToFnInfo>>,
  setLineStartId: React.Dispatch<React.SetStateAction<typeSelected>>,
  setNextFocus: (v: baseModel['id'] | undefined) => void,
) => {
  return {
    add_claim: useCallback(
      (e?: Event | React.SyntheticEvent) => {
        e?.preventDefault();
        if (!is_switch_for_append_id(selected)) {
          toastAndLog('Add Claim', 'Part, Point, Claim, Evidenceを選択してください', `invalid selected: ${selected}`);
          return;
        }
        setNextFocus(append_claim(selected)?.id);
      },
      [selected],
    ),
    add_point: useCallback(
      (e?: Event | React.SyntheticEvent) => {
        e?.preventDefault();
        if (!is_switch_for_append_id(selected)) {
          toastAndLog('Add Point', 'Part, Point, Claim, Evidenceを選択してください', `invalid selected: ${selected}`);
          return;
        }
        setNextFocus(append_sibling_point(selected)?.id);
      },
      [selected],
    ),
    add_point_to_parent: useCallback(
      (e?: Event | React.SyntheticEvent) => {
        e?.preventDefault();
        if (!is_switch_for_append_id(selected)) {
          toastAndLog(
            'Add Point to Parent',
            'Part, Point, Claim, Evidenceを選択してください',
            `invalid selected: ${selected}`,
          );
          return;
        }
        setNextFocus(append_point_to_parent(selected)?.id);
      },
      [selected],
    ),
    add_point_child: useCallback(
      (e?: Event | React.SyntheticEvent) => {
        e?.preventDefault();
        if (!is_switch_for_append_id(selected)) {
          toastAndLog(
            'Add Point Child',
            'Part, Point, Claim, Evidenceを選択してください',
            `invalid selected: ${selected}`,
          );
          return;
        }
        setNextFocus(append_point_child(selected)?.id);
      },
      [selected],
    ),
    add_point_to_part: useCallback(
      (e?: Event | React.SyntheticEvent) => {
        e?.preventDefault();
        if (!is_switch_for_append_id(selected)) {
          toastAndLog(
            'Add Point to Part',
            'Part, Point, Claim, Evidenceを選択してください',
            `invalid selected: ${selected}`,
          );
          return;
        }
        setNextFocus(append_point_to_part(selected)?.id);
      },
      [selected],
    ),
    draw_line: useCallback(
      (e?: Event | React.SyntheticEvent) => {
        e?.preventDefault();
        if (!id_is_PointChild(selected)) {
          toastAndLog('反駁先の指定', 'Point, Claim, Evidenceを選択してください', `invalid selected: ${selected}`);
          return;
        }
        setRebutToFn((_) => [set_rebut_to(selected), document.activeElement as HTMLElement | null]);
        setLineStartId(selected);
      },
      [selected],
    ),
    add_evidence: useCallback(
      (e?: Event | React.SyntheticEvent) => {
        e?.preventDefault();
        if (!is_switch_for_append_id(selected)) {
          toastAndLog(
            'Add Evidence',
            'Part, Point, Claim, Evidenceを選択してください',
            `invalid selected: ${selected}`,
          );
          return;
        }
        setNextFocus(append_evidence(selected)?.id);
      },
      [selected],
    ),
  };
};

type typeHotkeys = { [keys: string]: ReturnType<typeof useHotkeys> };

const useAppHotkeys = (
  selected: typeSelected,
  setRebutToFn: React.Dispatch<React.SetStateAction<rebutToFnInfo>>,
  escapeFn: (e?: Event | React.SyntheticEvent) => void,
  setLineStartId: React.Dispatch<React.SetStateAction<typeSelected>>,
  setNextFocus: (v: baseModel['id'] | undefined) => void,
): typeHotkeys => {
  const { add_claim, add_point, add_point_to_parent, add_point_child, add_point_to_part, draw_line, add_evidence } =
    useAppEventListeners(selected, setRebutToFn, setLineStartId, setNextFocus);
  return {
    'alt+c': useHotkeys('alt+c', add_claim, { enableOnTags: ['INPUT', 'TEXTAREA'] }),
    'alt+e': useHotkeys('alt+e', add_evidence, { enableOnTags: ['INPUT', 'TEXTAREA'] }),
    'alt+p': useHotkeys('alt+p', add_point, { enableOnTags: ['INPUT', 'TEXTAREA'] }),
    'alt+shift+p': useHotkeys('alt+shift+p', add_point_to_parent, { enableOnTags: ['INPUT', 'TEXTAREA'] }),
    'alt+ctrl+shift+p': useHotkeys('alt+ctrl+shift+p', add_point_to_part, { enableOnTags: ['INPUT', 'TEXTAREA'] }),
    'alt+l': useHotkeys('alt+l', draw_line, { enableOnTags: ['INPUT', 'TEXTAREA'] }),
    'alt+ctrl+p': useHotkeys('alt+ctrl+p', add_point_child, { enableOnTags: ['INPUT', 'TEXTAREA'] }),
    'esc': useHotkeys('esc', escapeFn, { enableOnTags: ['INPUT', 'TEXTAREA'] }),
  };
};

type MovingDivLineProps = {
  idToPointRef: idToPointRef;
  lineStartId: typeSelected;
  onMouseMoveFnRef: React.MutableRefObject<(e: React.MouseEvent) => void>;
};
const MovingDivLine: React.FC<MovingDivLineProps> = (props) => {
  const [pointerCoord, setPointerCoord] = useState<[number, number]>([0, 0]);
  const [line, setLine] = useState<LeaderLine | undefined>(undefined);
  const updateLine = useCallback(() => {
    try {
      line?.position();
      line?.show();
    } catch (e) {
      if (!(e instanceof TypeError)) throw e; // lineがremove済みのときLeaderLineはTypeErrorを返すため、それだけ無視
    }
  }, [line]);
  props.onMouseMoveFnRef.current = useCallback((e: React.MouseEvent) => setPointerCoord([e.clientX, e.clientY]), []);
  return (
    <MovingDivLineInner
      coord={pointerCoord}
      lineStartId={props.lineStartId}
      idToPointRef={props.idToPointRef}
      setLine={setLine}
      updateLine={updateLine}
    />
  );
};
const MovingDivLineInner: React.FC<{
  coord: [number, number];
  lineStartId: typeSelected;
  idToPointRef: idToPointRef;
  setLine: React.Dispatch<React.SetStateAction<LeaderLine | undefined>>;
  updateLine: () => void;
}> = (props) => {
  const thisRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let newLine: LeaderLine | undefined = undefined;
    if (id_is_mPoint(props.lineStartId)) {
      if (props.idToPointRef[props.lineStartId] !== undefined) {
        const [start, end] = [props.idToPointRef[props.lineStartId].current, thisRef.current];
        if (start !== null && end !== null) newLine = createLeaderLine(start, end);
      }
    }
    props.setLine(newLine);
    return () => newLine?.remove();
  }, [props.lineStartId]);
  useEffect(() => props.updateLine(), [props.coord, props.lineStartId, props.updateLine]);
  return (
    <div
      ref={thisRef}
      css={css`
        & {
          width: 1px;
          height: 1px;
          pointer-events: none;
          visibility: none;
          position: fixed;
        }
      `}
      style={{ left: `${props.coord[0]}px`, top: `${props.coord[1]}px` }}
    ></div>
  );
};

const toggleFullscreen = () => {
  if (!document.fullscreenEnabled) {
    toastAndLog('全画面表示失敗', 'このブラウザでは使用できません');
    return;
  }
  if (!document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .catch((e) => toastAndLog('全画面表示失敗', 'エラーが発生しました', `${e.message} (${e.name})`));
  } else {
    document.exitFullscreen();
  }
};

function App() {
  const [matchID, setMatchID] = useState<mMatch['id'] | undefined>(undefined);
  // 初めに1回だけ実行
  useLayoutEffect(() => {
    setMatchID(
      generate_match({
        aff: ['AC', 'NQ', '1NR', '1AR', '2NR', '2AR'],
        neg: ['NC', 'AQ', '1AR', '2NR', '2AR'],
      }).id,
    ); // TODO: sideの構成をハードコーディングしているため、設定用Repositoryなどに切り出す
  }, []);
  const [selected, setSelected] = useState<typeSelected>(undefined);
  const [rebutToFn, setRebutToFn] = useState<rebutToFnInfo>(undefined);
  const [idToPointRef, setIdToPointRef] = useState<idToPointRef>({});
  const [nextFocus, setNextFocus] = useState<baseModel['id'] | undefined>(undefined);
  const [lineStartId, setLineStartId] = useState<typeSelected>(undefined);
  const { onClick: onClickToRebut, stop: stopToRebut } = useOnClickToRebut(
    idToPointRef,
    rebutToFn,
    setRebutToFn,
    setLineStartId,
  );
  const operations = useAppEventListeners(selected, setRebutToFn, setLineStartId, setNextFocus);
  const [loadFileName, setLoadFileName] = useState<string | undefined>(undefined);
  const [LoadFileModal, openLoadFileModal, closeLoadFileModal, isOpenLoadFileModal] = useLoadFileModal(
    setMatchID,
    setLoadFileName,
  );
  const [HelpModal, openHelpModal, closeHelpModal, isOpenHelpModal] = useHelpModal();
  const [TutorialModal, openTutorialModal, closeTutorialModal, isOpenTutorialModal] = useTutorialModal();
  useAppHotkeys(selected, setRebutToFn, stopToRebut, setLineStartId, setNextFocus);
  const onMouseMoveFnRef = useRef((e: React.MouseEvent) => {});
  const AppContextValue = useDependentObj(
    {
      Callbacks: {
        Point: {
          onClick: onClickToRebut,
        },
      },
      Refs: {
        idToPointRef: {
          get: idToPointRef,
          add: (_new: idToPointRef) => setIdToPointRef((state) => ({ ...state, ..._new })),
        },
        nextFocus: {
          get: nextFocus,
          set: setNextFocus,
        },
      },
    },
    [onClickToRebut, idToPointRef, setIdToPointRef, nextFocus, setNextFocus],
  );
  const [ToolBar, isToolBarOpen, toggleToolBarOpen] = useToolBar();
  const menuBarItems = [
    {
      label: 'ファイル',
      items: [
        { label: 'ファイルを開く', onClick: openLoadFileModal },
        { label: 'ファイルを保存', onClick: () => matchID && saveMatch(matchID, loadFileName) },
        { label: '設定', onClick: () => alert('未実装です') },
      ],
    },
    {
      label: '編集',
      items: [
        { label: '論点を追加', onClick: operations.add_point },
        { label: 'クレームを追加', onClick: operations.add_claim },
        { label: '証拠資料を追加', onClick: operations.add_evidence },
        { label: 'パートに論点を追加', onClick: operations.add_point_to_part },
        { label: '論点を削除', onClick: () => alert('未実装です') },
        { label: 'パートを編集', onClick: () => alert('未実装です') },
      ],
    },
    {
      label: '表示',
      items: [
        { label: '全画面表示', onClick: toggleFullscreen },
        { label: `操作ボタンの${isToolBarOpen ? '非表示' : '表示'}`, onClick: toggleToolBarOpen },
      ],
    },
    {
      label: 'ヘルプ',
      items: [
        { label: 'ヘルプ画面', onClick: openHelpModal },
        {
          label: '質問・バグ報告・機能要望を送信',
          onClick: () => {
            alert('コメントはGitHub Discussionsで受け付けます。リンク先から適切なカテゴリを選んで投稿してください');
            window.open('https://github.com/stringthread/flowsheet/discussions/new/choose', '_blank');
          },
        },
        { label: '投げ銭', onClick: () => alert('未実装です') },
      ],
    },
  ];
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContext.Provider value={AppContextValue}>
          <div onMouseMove={onMouseMoveFnRef.current} className='App'>
            <MenuBar items={menuBarItems} />
            <ToolBar operations={operations} />
            <MovingDivLine idToPointRef={idToPointRef} lineStartId={lineStartId} onMouseMoveFnRef={onMouseMoveFnRef} />
            {matchID ? <Match matchID={matchID} setSelected={setSelected} /> : null}
            <LoadFileModal />
            <HelpModal />
            <TutorialModal />
          </div>
          <ToastContainer
            position='top-center'
            style={{
              color: 'red',
            }}
          />
        </AppContext.Provider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
