import React,{useState,useCallback,useLayoutEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {point_slice} from 'stores/slices/point'
import {id_is_mPart, id_is_mPoint} from 'stores/ids';
import {Match} from './Match';
import {mPoint} from 'models/mPoint';
import {generate_match} from 'services/match';
import {part_add_child} from 'services/part';
import {point_add_child} from 'services/point';

export type typeSelected=string|undefined;

function App() {
  const [matchID,setMatchID]=useState<string>('');
  useLayoutEffect(()=>{
    setMatchID(generate_match({
      aff: ['AC','NQ','1NR','1AR','2NR','2AR'],
      neg: ['NC','AQ','1AR','2NR','2AR'],
    }).id); // TODO: sideの構成をハードコーディングしているため、設定用Repositoryなどに切り出す
  },[]);
  const [selected, setSelected]=useState<typeSelected>(undefined);
  const add_claim_btn=(e: React.MouseEvent)=>{
    if(selected==undefined) return;
    let child:mPoint|undefined=undefined;
    if(id_is_mPart(selected)) child=part_add_child(selected);
    else if(id_is_mPoint(selected)) child=point_add_child(selected,true);
    if(child!==undefined) store.dispatch(point_slice.actions.upsertOne({
      ...child,
      contents: '', // string型にすればClaimとして認識される
    }));
  };
  const add_point_btn=(e: React.MouseEvent)=>{
    if(selected==undefined) return;
    if(selected[1]=='part') part_add_child(selected);
    else if(selected[1]=='point') point_add_child(selected,true);
  };
  const add_evidence_btn=(e: React.MouseEvent)=>{
    if(selected==undefined) return;
    if(id_is_mPoint(selected)) point_add_child(selected,false);
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
