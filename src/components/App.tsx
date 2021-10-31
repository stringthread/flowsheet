import React,{useState,useCallback,useLayoutEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {point_slice} from 'stores/slices/point'
import {Match} from './Match';
import {generate_match} from 'models/mMatch';
import {part_add_child} from 'models/mPart';
import {mPoint,point_add_child} from 'models/mPoint';

export type typeSelected=[string|undefined,string|undefined];

function App() {
  const [matchID,setMatchID]=useState<string>('');
  useLayoutEffect(()=>{
    setMatchID(generate_match({
      aff: ['AC','NQ','1NR','1AR','2NR','2AR'],
      neg: ['NC','AQ','1AR','2NR','2AR'],
    }).id); // TODO: sideの構成をハードコーディングしているため、設定用Repositoryなどに切り出す
  },[]);
  const [selected, setSelected]=useState<typeSelected>([undefined,undefined]); // [選択された要素のID, 要素種別]
  const add_claim_btn=(e: React.MouseEvent)=>{
    if(selected[0]==undefined) return;
    let child:mPoint|undefined=undefined;
    if(selected[1]=='part') child=part_add_child(selected[0]);
    else if(selected[1]=='point') child=point_add_child(selected[0],true);
    if(child!==undefined) store.dispatch(point_slice.actions.upsertOne({
      ...child,
      contents: '', // string型にすればClaimとして認識される
    }));
  };
  const add_point_btn=(e: React.MouseEvent)=>{
    if(selected[0]==undefined) return;
    if(selected[1]=='part') part_add_child(selected[0]);
    else if(selected[1]=='point') point_add_child(selected[0],true);
  };
  const add_evidence_btn=(e: React.MouseEvent)=>{
    if(selected[0]==undefined) return;
    if(selected[1]=='point') point_add_child(selected[0],false);
  };
  return (
    <Provider store={store}>
      <div className="App">
        <Match matchID={matchID} setSelected={setSelected} />
        <button onClick={add_claim_btn}>Add Claim</button>
        <button onClick={add_point_btn}>Add Point</button>
        <button onClick={add_evidence_btn}>Add Evidence</button>
      </div>
    </Provider>
  );
}

export default App;
