import { Reducer, combineReducers, } from '@reduxjs/toolkit';
import welcomeReducer from './slices/initial/initialslice';
export type StateType = {
};

const rootReducer: Reducer = combineReducers({
    welcome: welcomeReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
