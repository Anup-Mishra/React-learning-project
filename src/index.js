import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import burgerBuilderreducer from './store/reducers/burgerBuilder';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import createSagaMiddleware from 'redux-saga';
import { watchAuth, watchBurgerBuilder, watchOrder } from './store/sagas';

const composeEnhancers = process.env.NODE_ENV==='development'?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :null|| compose;

const rootReducer = combineReducers({
    burgerBuilder: burgerBuilderreducer,
    order: orderReducer,
    auth: authReducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk,sagaMiddleware)));

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchBurgerBuilder);
sagaMiddleware.run(watchOrder);

const app = (
  <Provider store={store} >
    <BrowserRouter>
      <React.StrictMode>
    <App />
  </React.StrictMode>
    </BrowserRouter>
    </Provider>
);
ReactDOM.render(
app,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
