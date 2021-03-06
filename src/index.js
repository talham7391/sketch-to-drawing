import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';
import './style.css';
import * as serviceWorker from './serviceWorker';

window.onbeforeunload = function () {
  return true;
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
