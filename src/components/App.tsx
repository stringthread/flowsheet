import React,{useState} from 'react';
import {Match} from './Match';
import {mMatch} from 'models/mMatch';

function App() {
  const [match,setMatch]=useState({} as mMatch); // TODO: 有効なオブジェクトを渡す手段を考える
  return (
    <div className="App">
      <Match match={match} />
    </div>
  );
}

export default App;
