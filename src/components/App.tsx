import React,{useState,useCallback,useLayoutEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {point_slice} from 'stores/slices/point'
import {id_is_mPart, id_is_mPoint} from 'stores/ids';
import {Match} from './Match';
import {mPoint} from 'models/mPoint';
import {generate_match} from 'services/match';
import {point_add_child, append_claim, append_point} from 'services/point';

import hotkeys from 'hotkeys-js';

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
  const add_claim=(_?:Event|React.SyntheticEvent)=>{
    if(selected==undefined) return;
    append_claim(selected);
  };
  const add_point=(_?:Event|React.SyntheticEvent)=>{
    if(selected==undefined) return;
    append_point(selected);
  };
  const add_point_to_part=(_?:Event|React.SyntheticEvent)=>{
    if(selected==undefined) return;
    if(id_is_mPart(selected)) part_add_child(selected);
    else if(id_is_mPoint(selected)) point_add_child(selected,true); // TODO: 親のPartを見つけてpart_add_child()にする
  };
  const draw_line=(_?:Event|React.SyntheticEvent)=>{}; // TODO: 宣言のみ。実装は後日
  const add_evidence=(_?:Event|React.SyntheticEvent)=>{
    if(selected==undefined) return;
    if(id_is_mPoint(selected)) point_add_child(selected,false);
  };
  const keyMaps = [
    {
      sequence: 'ctrl+alt+c',
      handler: add_claim,
    },
    {
      sequence: 'ctrl+alt+e',
      handler: add_evidence,
    },
    {
      sequence: 'ctrl+alt+p',
      handler: add_point,
    },
    {
      sequence: 'ctrl+alt+shift+p',
      handler: add_point_to_part,
    },
    {
      sequence: 'ctrl+alt+c',
      handler: draw_line,
    },
  ];
  const sequences = keyMaps.map(keyMap => keyMap.sequence)
  // 初めに1回だけ実行
  useLayoutEffect(()=>{
    setMatchID(generate_match({
      aff: ['AC','NQ','1NR','1AR','2NR','2AR'],
      neg: ['NC','AQ','1AR','2NR','2AR'],
    }).id); // TODO: sideの構成をハードコーディングしているため、設定用Repositoryなどに切り出す
    hotkeys(sequences.join(','), (e, handler) => {
      const keyMap = keyMaps.find(({ sequence }) => sequence === handler.key);
      if (!keyMap) return;
      keyMap.handler(e);
    });
  },[]);
  
  return (
    <Provider store={store}>
      <div className="App">
        <Match matchID={matchID} setSelected={setSelected} />
        <button onClick={add_claim}>Add Claim</button>
        <button onClick={add_point}>Add Point</button>
        <button onClick={add_evidence}>Add Evidence</button>
      </div>
    </Provider>
  );
}

export default App;
