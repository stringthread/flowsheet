import React,{useState} from 'react';
import {Provider} from 'react-redux';
import {store} from 'stores/index';
import {Match} from './Match';

function App() {
  const [matchID,setMatchID]=useState('DUMMY_MATCH_ID'); // TODO: 有効なオブジェクトを渡す手段を考える
  return (
    <Provider store={store}>
      <div className="App">
        <Match matchID={matchID} />
      </div>
    </Provider>
  );
}

export default App;
