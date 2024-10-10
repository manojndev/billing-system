import { configureStore, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import { useDispatch } from 'react-redux';

const sagaMiddleware = createSagaMiddleware();
const store: Store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        process.env.NODE_ENV === 'development'
            ? getDefaultMiddleware().concat(sagaMiddleware, logger)
            : getDefaultMiddleware().concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
export default store;
