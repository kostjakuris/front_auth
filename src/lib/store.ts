import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slice';
import { authApi } from './authApi';
import { userApi } from './userApi';


const userReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});
export const setupStore = () => {
  return configureStore({
    reducer: userReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware).concat(userApi.middleware),
  });
};

export type AppStore = ReturnType<typeof setupStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']