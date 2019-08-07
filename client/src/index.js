import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider} from 'react-redux'
import {
    BrowserRouter as Router,
} from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import App from './App'
import './App.css'

const store = createStore(rootReducer, applyMiddleware(thunk, logger))



ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
)

// If you want your client to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
