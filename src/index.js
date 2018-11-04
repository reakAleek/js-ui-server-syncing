// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import {reducer} from "./+store/reducer";
import syncStatusMiddleware from "./+store/middlewares/syncStatusMiddleware";
import apiMiddleware from "./+store/middlewares/apiMiddleware";
import MockHttpApi from "./services/mockHttpApi";
import PersonService from "./services/personService";

const http = new MockHttpApi();
const personService = new PersonService(http);

const store = createStore(reducer, applyMiddleware(apiMiddleware(personService), syncStatusMiddleware));

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
