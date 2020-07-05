
import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import gameReducer from '../reducer/game'
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const rootReducer = combineReducers({ gameReducer })

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2
   }

const pReducer = persistReducer(persistConfig, rootReducer)

export default function configureStore() {

    const store = createStore(pReducer, applyMiddleware(thunk))
    const persistor = persistStore(store)
    return { persistor, store }
  }