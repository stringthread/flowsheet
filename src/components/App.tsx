import React,{useState,useCallback,useLayoutEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {point_slice} from 'stores/slices/point'
import {id_is_mPart, id_is_mPoint} from 'services/id';
import {Match} from './Match';
import {mPoint} from 'models/mPoint';
import { mEvidenceSignature } from 'models/mEvidence';
import {generate_match} from 'services/match';
import {point_add_child, append_sibling_point, append_point_to_part, append_point_child} from 'services/point';

import {useHotkeys} from 'react-hotkeys-hook';
import { append_claim } from 'services/claim';
import { append_evidence } from 'services/evidence';

export type typeSelected=string|undefined;

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
  const add_claim=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_claim(selected);
  };
  const add_point=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_sibling_point(selected);
  };
  const add_point_child=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_point_child(selected);
  };
  const add_point_to_part=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_point_to_part(selected);
  };
  const draw_line=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    // TODO: 実装は後日
  };
  const add_evidence=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    append_evidence(selected);
  };
  useHotkeys('alt+c', add_claim, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+e', add_evidence, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+p', add_point, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+shift+p', add_point_to_part, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+l', draw_line, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+ctrl+p', add_point_child, { enableOnTags: ['INPUT','TEXTAREA'] });
  
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
