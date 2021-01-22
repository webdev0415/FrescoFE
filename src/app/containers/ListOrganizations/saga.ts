import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

export function* listOrganizations(action) {
  const { payload } = action;
  const { history, token } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.get('organization/');
    yield put(actions.listOrganizationsSuccess(response.data));
  } catch (error) {
    // history.push('/err');
    yield put(
      actions.listOrganizationsError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* listOrganizationsSaga() {
  yield all([
    takeLatest(actions.listOrganizationsRequest.type, listOrganizations),
  ]);
}
