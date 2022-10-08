import { Global } from '@emotion/react';
import App from 'components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { sanitize_css } from 'sanitize.css';

ReactDOM.render(
  <React.StrictMode>
    <Global styles={sanitize_css} />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
