import React,{useState} from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {Match} from './Match';
import {generate_match} from 'models/mMatch';

function App() {
  const [matchID,setMatchID]=useState(generate_match({
    aff: ['AC','NQ','1NR','1AR','2NR','2AR'],
    neg: ['NC','AQ','1AR','2NR','2AR'],
  }).id); // TODO: sideの構成をハードコーディングしているため、設定用Repositoryなどに切り出す
  return (
    <Provider store={store}>
      <div className="App">
        <Match matchID={matchID} />
      </div>
    </Provider>
  );
}

export default App;
