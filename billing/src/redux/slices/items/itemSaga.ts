import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchWelcomeSuccess, fetchWelcomeFailure, fetchWelcomeStart } from './itemslice';
import { fetchWelcomeApi } from './itemapi';

function* fetchWelcomeSaga(): any {
    try {
        const response = yield call(fetchWelcomeApi);
        yield put(fetchWelcomeSuccess(response.data));
    } catch (error: any) {
        yield put(fetchWelcomeFailure(error?.message));
    }
}

export default function* welcomeSaga() {
    yield takeLatest(fetchWelcomeStart.type, fetchWelcomeSaga);
}
