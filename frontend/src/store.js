import {createStore} from 'redux';
import reducer from './reducers/index';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ["instructionState"],
  };
  
  const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer,  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const persistor = persistStore(store);
export default store;