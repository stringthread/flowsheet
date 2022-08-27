import React,{useState, useLayoutEffect, useCallback, useContext, createContext, useRef, useEffect } from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {point_slice} from 'stores/slices/point'
import {get_from_id, id_is_mPart, id_is_mPoint} from 'services/id';
import {Match} from './Match';
import {mPoint} from 'models/mPoint';
import { mEvidenceSignature } from 'models/mEvidence';
import {generate_match} from 'services/match';
import { useHotkeys } from 'react-hotkeys-hook';
import { append_claim } from 'services/claim';
import { append_evidence } from 'services/evidence';
import { append_sibling_point, append_point_child, append_point_to_part, set_rebut_to, append_point_to_parent } from 'services/point';
import { Point } from './Point';
import { useCheckDepsUpdate, useDependentObj, usePreviousValue } from 'util/hooks';
import { css } from '@emotion/react';
import LeaderLine from 'leader-line-new';
import { baseModel } from 'models/baseModel';
import { saveMatch } from 'repositories/encoder';

export type typeSelected=string|undefined;

type idToPointRef = {[id: mPoint['id']]: React.RefObject<HTMLElement>};

export type AppContext = {
  Callbacks: {
    Point?: {
      onClick: ((e: React.SyntheticEvent<HTMLElement>)=>void)|undefined;
    };
  };
  Refs: {
    idToPointRef: { get: idToPointRef; add: (_:idToPointRef)=>void; };
    nextFocus: { get: baseModel['id']|undefined; set: (v:baseModel['id']|undefined)=>void;}
  }
};
export const AppContext = createContext<AppContext|undefined>(undefined);

type rebutToFnInfo = [ReturnType<typeof set_rebut_to>, HTMLElement|null]|undefined;
const useOnClickToRebut = (idToPointRef: idToPointRef, rebutToFnInfo: rebutToFnInfo, setRebutToFn: React.Dispatch<React.SetStateAction<rebutToFnInfo>>, setLineStartId: React.Dispatch<React.SetStateAction<typeSelected>>)=>{
  const stop = useCallback(()=>{
    setLineStartId(undefined);
    setRebutToFn(undefined);
  }, [setRebutToFn]);
  const onClick = useCallback((e: React.SyntheticEvent<HTMLElement>)=>{
    if(rebutToFnInfo===undefined) return;
    const [rebutToFn, previousActive] = rebutToFnInfo;
    const data_modelid = e.currentTarget.getAttribute('data-modelid');
    if(typeof data_modelid!=='string' || !id_is_mPoint(data_modelid)) return;
    e.stopPropagation();
    e.preventDefault();
    if(e.target instanceof HTMLElement) e.target.blur();
    rebutToFn(data_modelid);
    stop();
    if(previousActive!==null) previousActive.focus();
  }, [idToPointRef, rebutToFnInfo, stop]);
  return {onClick, stop};
};

const useAppEventListeners = (selected: typeSelected, setRebutToFn: React.Dispatch<React.SetStateAction<rebutToFnInfo>>, setLineStartId: React.Dispatch<React.SetStateAction<typeSelected>>, setNextFocus: (v: baseModel['id']|undefined)=>void)=>{
  return {
    add_claim: useCallback((e?:Event|React.SyntheticEvent)=>{
      e?.preventDefault();
      if(selected==undefined) return;
      setNextFocus(append_claim(selected)?.id);
    }, [selected]),
    add_point: useCallback((e?:Event|React.SyntheticEvent)=>{
      e?.preventDefault();
      if(selected==undefined) return;
      setNextFocus(append_sibling_point(selected)?.id);
    }, [selected]),
    add_point_to_parent: useCallback((e?:Event|React.SyntheticEvent)=>{
      e?.preventDefault();
      if(selected==undefined) return;
      setNextFocus(append_point_to_parent(selected)?.id);
    }, [selected]),
    add_point_child: useCallback((e?:Event|React.SyntheticEvent)=>{
      e?.preventDefault();
      if(selected==undefined) return;
      setNextFocus(append_point_child(selected)?.id);
    }, [selected]),
    add_point_to_part: useCallback((e?:Event|React.SyntheticEvent)=>{
      e?.preventDefault();
      if(selected==undefined) return;
      setNextFocus(append_point_to_part(selected)?.id);
    }, [selected]),
    draw_line: useCallback((e?:Event|React.SyntheticEvent)=>{
      e?.preventDefault();
      if(selected==undefined) return;
      setRebutToFn(_=>[set_rebut_to(selected), document.activeElement as HTMLElement|null]);
      setLineStartId(selected);
    }, [selected]),
    add_evidence: useCallback((e?:Event|React.SyntheticEvent)=>{
      e?.preventDefault();
      if(selected==undefined) return;
      setNextFocus(append_evidence(selected)?.id);
    }, [selected]),
  };
};

type typeHotkeys = { [keys: string]: ReturnType<typeof useHotkeys>; };

const useAppHotkeys = (selected: typeSelected, setRebutToFn: React.Dispatch<React.SetStateAction<rebutToFnInfo>>, escapeFn: (e?: Event | React.SyntheticEvent)=>void, setLineStartId: React.Dispatch<React.SetStateAction<typeSelected>>, setNextFocus: (v: baseModel['id']|undefined)=>void): typeHotkeys=>{
  const {add_claim, add_point, add_point_to_parent, add_point_child, add_point_to_part, draw_line, add_evidence} = useAppEventListeners(selected, setRebutToFn, setLineStartId, setNextFocus);
  return {
    'alt+c': useHotkeys('alt+c', add_claim, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+e': useHotkeys('alt+e', add_evidence, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+p': useHotkeys('alt+p', add_point, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+shift+p': useHotkeys('alt+shift+p', add_point_to_parent, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+ctrl+shift+p': useHotkeys('alt+ctrl+shift+p', add_point_to_part, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+l': useHotkeys('alt+l', draw_line, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+ctrl+p': useHotkeys('alt+ctrl+p', add_point_child, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'esc': useHotkeys('esc', escapeFn, { enableOnTags: ['INPUT','TEXTAREA'] }),
  };
};

type MovingDivLineProps = {
  idToPointRef: idToPointRef;
  lineStartId: typeSelected;
  onMouseMoveFnRef: React.MutableRefObject<(e: React.MouseEvent)=>void>
};
const MovingDivLine: React.FC<MovingDivLineProps> = (props)=>{
  const [pointerCoord, setPointerCoord] = useState<[number, number]>([0,0]);
  const [line, setLine] = useState<LeaderLine|undefined>(undefined);
  const updateLine = useCallback(()=>{
    try {
      line?.position();
      line?.show();
    } catch(e) {
      if(!(e instanceof TypeError)) throw e; // lineがremove済みのときLeaderLineはTypeErrorを返すため、それだけ無視
    }
  }, [line]);
  props.onMouseMoveFnRef.current = useCallback((e: React.MouseEvent)=>setPointerCoord([e.clientX, e.clientY]), []);
  return (<MovingDivLineInner coord={pointerCoord} lineStartId={props.lineStartId} idToPointRef={props.idToPointRef} setLine={setLine} updateLine={updateLine} />);
};
const MovingDivLineInner: React.FC<{
  coord: [number, number];
  lineStartId: typeSelected;
  idToPointRef: idToPointRef;
  setLine: React.Dispatch<React.SetStateAction<LeaderLine|undefined>>;
  updateLine: ()=>void;
}> = props=>{
  const thisRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let newLine: LeaderLine|undefined =undefined;
    if(props.lineStartId!==undefined){
      if(props.idToPointRef[props.lineStartId]!==undefined){
        const [start, end] = [props.idToPointRef[props.lineStartId].current, thisRef.current];
        if(start!==null && end!==null) newLine=new LeaderLine(start, end);
      }
    }
    props.setLine(newLine);
    return ()=>newLine?.remove();
  }, [props.lineStartId]);
  useEffect(()=>props.updateLine(), [props.coord, props.lineStartId, props.updateLine]);
  return (<div ref={thisRef} css={css`
    & {
      width: 1px;
      height: 1px;
      pointer-events: none;
      visibility: none;
      position: fixed;
    }
  `} style={{left: `${props.coord[0]}px`, top: `${props.coord[1]}px`}}></div>);
};

function App() {
  const [matchID,setMatchID]=useState<string>('');
  // 初めに1回だけ実行
  useLayoutEffect(()=>{
    setMatchID(generate_match({
      aff: ['AC','NQ','1NR','1AR','2NR','2AR'],
      neg: ['NC','AQ','1AR','2NR','2AR'],
    }).id); // TODO: sideの構成をハードコーディングしているため、設定用Repositoryなどに切り出す
  },[]);
  const [selected, setSelected]=useState<typeSelected>(undefined);
  const [rebutToFn, setRebutToFn] = useState<rebutToFnInfo>(undefined);
  const [idToPointRef, setIdToPointRef] = useState<idToPointRef>({});
  const [nextFocus, setNextFocus] = useState<baseModel['id']|undefined>(undefined);
  const [lineStartId, setLineStartId] = useState<typeSelected>(undefined);
  const {onClick: onClickToRebut, stop: stopToRebut} = useOnClickToRebut(idToPointRef, rebutToFn, setRebutToFn, setLineStartId);
  const {add_claim, add_point, add_point_to_part, add_evidence}=useAppEventListeners(selected, setRebutToFn, setLineStartId, setNextFocus);
  useAppHotkeys(selected, setRebutToFn, stopToRebut, setLineStartId, setNextFocus);
  const onMouseMoveFnRef = useRef((e: React.MouseEvent)=>{});
  const AppContextValue = useDependentObj({
    Callbacks: {
      Point: {
        onClick: onClickToRebut,
      },
    },
    Refs: {
      idToPointRef: {
        get: idToPointRef,
        add: (_new: idToPointRef) => setIdToPointRef(state=>({ ...state, ..._new })),
      },
      nextFocus: {
        get: nextFocus, set: setNextFocus
      }
    },
  }, [onClickToRebut, idToPointRef, setIdToPointRef, nextFocus, setNextFocus]);
  return (
    <Provider store={store}>
      <AppContext.Provider value={AppContextValue}>
        <div onMouseMove={onMouseMoveFnRef.current} className="App">
          <MovingDivLine idToPointRef={idToPointRef} lineStartId={lineStartId} onMouseMoveFnRef={onMouseMoveFnRef} />
          <Match matchID={matchID} setSelected={setSelected} />
          <button onClick={add_claim}>Add Claim</button>
          <button onClick={add_point}>Add Point</button>
          <button onClick={add_point_to_part}>Add Point to Part</button>
          <button onClick={add_evidence}>Add Evidence</button>
          <button onClick={()=>saveMatch(matchID)}>save</button>
        </div>
      </AppContext.Provider>
    </Provider>
  );
}

export default App;
