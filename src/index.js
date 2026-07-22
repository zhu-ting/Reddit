import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import reducer from "./reducers"
import thunk from 'redux-thunk'

const middleware = [ thunk ]
const store = createStore(reducer, applyMiddleware(...middleware))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
