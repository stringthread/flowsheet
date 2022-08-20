import React,{useState,useCallback,useLayoutEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {point_slice} from 'stores/slices/point'
import {Match} from './Match';
import { ID_TYPE } from 'models';
import { mMatch, mMatchId, to_mMatchId } from 'models/mMatch';
import {is_mPointId, mPoint} from 'models/mPoint';
import {append_sibling_point, append_point_to_part} from 'services/point';
import { append_claim } from 'services/claim';
import {useHotkeys} from 'react-hotkeys-hook';
import { get_from_id } from 'services/id';
import { mSide } from 'models/mSide';
import { append_evidence } from 'services/evidence';
import { add_sides_and_parts } from 'services/match';

export type typeSelected=ID_TYPE|undefined;

function App() {
  const [match,setMatch]=useState<mMatch>(new mMatch({}));
  // 初めに1回だけ実行
  useLayoutEffect(()=>{
    add_sides_and_parts(match, {
      aff: ['AC','NQ','1NR','1AR','2NR','2AR'],
      neg: ['NC','AQ','1AR','2NR','2AR'],
    }); // TODO: sideの構成をハードコーディングしているため、設定用Repositoryなどに切り出す
  },[]);
  const [selected, setSelected]=useState<typeSelected>(undefined);
  const add_claim=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    const selectedObj = get_from_id(selected);
    if(selectedObj===undefined || selectedObj instanceof mMatch || selectedObj instanceof mSide) return;
    append_claim(selectedObj);
  };
  const add_point=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    const selectedObj = get_from_id(selected);
    if(selectedObj===undefined || selectedObj instanceof mMatch || selectedObj instanceof mSide) return;
    append_sibling_point(selectedObj);
  };
  const add_point_to_part=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    const selectedObj = get_from_id(selected);
    if(selectedObj===undefined || selectedObj instanceof mMatch || selectedObj instanceof mSide) return;
    append_point_to_part(selectedObj);
  };
  const draw_line=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    // TODO: 実装は後日
  };
  const add_evidence=(e?:Event|React.SyntheticEvent)=>{
    e?.preventDefault();
    if(selected==undefined) return;
    const selectedObj = get_from_id(selected);
    if(selectedObj===undefined || selectedObj instanceof mMatch || selectedObj instanceof mSide) return;
    append_evidence(selectedObj);
  };
  useHotkeys('alt+c', add_claim, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+e', add_evidence, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+p', add_point, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+shift+p', add_point_to_part, { enableOnTags: ['INPUT','TEXTAREA'] });
  useHotkeys('alt+c', draw_line, { enableOnTags: ['INPUT','TEXTAREA'] });
  
  return (
    <Provider store={store}>
      <div className="App">
        <Match matchID={match.id_obj} setSelected={setSelected} />
        <button onClick={add_claim}>Add Claim</button>
        <button onClick={add_point}>Add Point</button>
        <button onClick={add_point_to_part}>Add Point to Part</button>
        <button onClick={add_evidence}>Add Evidence</button>
      </div>
    </Provider>
  );
}

export default App;
