import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import appReducers from './reducers/reducers'
import App from './components/App'

let store = createStore(appReducers)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
