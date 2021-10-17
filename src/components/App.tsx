import React,{useState} from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {Match} from './Match';
import {generate_match} from 'models/mMatch';

export type typeSelected=[string|undefined,string|undefined];

function App() {
  const [matchID,setMatchID]=useState<string>(generate_match({
    aff: ['AC','NQ','1NR','1AR','2NR','2AR'],
    neg: ['NC','AQ','1AR','2NR','2AR'],
  }).id); // TODO: sideの構成をハードコーディングしているため、設定用Repositoryなどに切り出す
  const [selected, setSelected]=useState<typeSelected>([undefined,undefined]); // [選択された要素のID, 要素種別]
  return (
    <Provider store={store}>
      <div className="App">
        <Match matchID={matchID} setSelected={setSelected} />
      </div>
    </Provider>
  );
}

export default App;
