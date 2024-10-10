import { all } from 'redux-saga/effects';
import welcomeSaga from './slices/initial/initialSaga';

function* rootSaga() {
    yield all([
        welcomeSaga()
    ]);
}

export default rootSaga;
