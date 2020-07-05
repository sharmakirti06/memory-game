/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { PureComponent } from 'react';
import MainScreen from './screens/MainScreen'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux'
import configureStore from './store/configure'

const config = configureStore()
export default class App extends PureComponent {
  
  render() {
    return (
      <>
      <Provider store={config.store}>
        <PersistGate persistor={config.persistor}>
          <MainScreen />
        </PersistGate>
        </Provider>
      </>
    )
  } 
}
