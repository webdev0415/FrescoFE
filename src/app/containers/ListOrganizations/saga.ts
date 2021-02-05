import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';
import { parseApiError } from '../../../utils/common';

export function* listOrganizations(action) {
  const { payload } = action;
  const { history, token } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.get('organization/');
    yield put(actions.listOrganizationsSuccess(response.data));
  } catch (error) {
    // history.push('/err');
    const errorResponse = parseApiError(error);
    yield put(
      actions.listOrganizationsError({
        message: errorResponse.message,
        status: error.statusCode,
      }),
    );
    message.error(errorResponse.message);
  }
}

export function* listOrganizationsSaga() {
  yield all([
    takeLatest(actions.listOrganizationsRequest.type, listOrganizations),
  ]);
}
