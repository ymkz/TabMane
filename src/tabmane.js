import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'

import reducers from './reducers'

import App from './components/app'

import styles from './styles/init.css'

const middleware = [ logger ]
const store = compose(
  applyMiddleware(...middleware)
)(createStore)(reducers)

ReactDOM.render(
  <Provider store={store}>
    <App className={styles} />
  </Provider>,
  document.getElementById('root')
)
