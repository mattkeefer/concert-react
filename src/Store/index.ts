import {configureStore} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from "./userAuthReducer";

const persistConfig = {
  key: 'root',
  storage,
}

const userAuthReducer = persistReducer(persistConfig, rootReducer);

export interface UserAuthState {
  userAuthReducer: {
    userAuth: {_id: string, token: string};
  }
}

const store = configureStore({
  reducer: {
    userAuthReducer
  }
});

const persistor = persistStore(store);

export default {store, persistor};