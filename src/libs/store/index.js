import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import reducer from './reducer'

export default function configureStore(initialState) {
  if (process.env.NODE_ENV === 'production') {
    return compose(applyMiddleware(thunkMiddleware))(createStore)(
      reducer,
      initialState,
    )
  } else {
    const store = compose(
      applyMiddleware(thunkMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f,
    )(createStore)(reducer, initialState)

    if (module.hot) {
      module.hot.accept('./reducer', () => store.replaceReducer(reducer))
    }

    return store
  }
}
