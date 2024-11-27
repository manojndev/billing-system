import { all } from 'redux-saga/effects';
import welcomeSaga from './slices/items/itemSaga';

function* rootSaga() {
    yield all([
        welcomeSaga()
    ]);
}

export default rootSaga;
