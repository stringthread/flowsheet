import React,{useState, useLayoutEffect, useCallback } from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {point_slice} from 'stores/slices/point'
import {id_is_mPart, id_is_mPoint} from 'services/id';
import {Match} from './Match';
import {mPoint} from 'models/mPoint';
import { mEvidenceSignature } from 'models/mEvidence';
import {generate_match} from 'services/match';
import { useHotkeys } from 'react-hotkeys-hook';
import { append_claim } from 'services/claim';
import { append_evidence } from 'services/evidence';
import { append_sibling_point, append_point_child, append_point_to_part } from 'services/point';

export type typeSelected=string|undefined;

const useAppEventListeners = (selected: typeSelected)=>{
  const add_claim=useCallback((e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_claim(selected);
  }, [selected]);
  const add_point=useCallback((e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_sibling_point(selected);
  }, [selected]);
  const add_point_child=useCallback((e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_point_child(selected);
  }, [selected]);
  const add_point_to_part=useCallback((e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_point_to_part(selected);
  }, [selected]);
  const draw_line=useCallback((e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    // TODO: 実装は後日
  }, [selected]);
  const add_evidence=useCallback((e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_evidence(selected);
  }, [selected]);
  return {add_claim, add_point, add_point_child, add_point_to_part, draw_line, add_evidence};
};

type typeHotkeys = { [keys: string]: ReturnType<typeof useHotkeys>; };

const useAppHotkeys = (selected: typeSelected): typeHotkeys=>{
  const {add_claim, add_point, add_point_child, add_point_to_part, draw_line, add_evidence} = useAppEventListeners(selected);
  return {
    'alt+c': useHotkeys('alt+c', add_claim, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+e': useHotkeys('alt+e', add_evidence, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+p': useHotkeys('alt+p', add_point, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+shift+p': useHotkeys('alt+shift+p', add_point_to_part, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+l': useHotkeys('alt+l', draw_line, { enableOnTags: ['INPUT','TEXTAREA'] }),
    'alt+ctrl+p': useHotkeys('alt+ctrl+p', add_point_child, { enableOnTags: ['INPUT','TEXTAREA'] }),
  };
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
  const {add_claim, add_point, add_point_to_part, add_evidence}=useAppEventListeners(selected);
  useAppHotkeys(selected);
  return (
    <Provider store={store}>
      <div className="App">
        <Match matchID={matchID} setSelected={setSelected} />
        <button onClick={add_claim}>Add Claim</button>
        <button onClick={add_point}>Add Point</button>
        <button onClick={add_point_to_part}>Add Point to Part</button>
        <button onClick={add_evidence}>Add Evidence</button>
      </div>
    </Provider>
  );
}

export default App;
