import React from 'react';
import ReactDOM from 'react-dom';
import {Global} from '@emotion/react';
import {sanitize_css} from 'sanitize.css';
import App from 'components/App';

ReactDOM.render(
  <React.StrictMode>
    <Global styles={sanitize_css} />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
