import { all, put, takeLatest } from 'redux-saga/effects';
import { message, Modal } from 'antd';
import axios from 'axios';

import { actions } from './slice';
import { actions as globalActions } from '../../slice';

export function* signIn(action) {
  try {
    const { payload } = action;
    const { history } = payload;
    const response = yield axios.post('auth/login', payload.data);
    yield put(actions.signInSuccess(response.data));
    yield put(globalActions.setAuthInformation(response.data));
    localStorage.setItem('authInformation', JSON.stringify(response.data));
    message.success('Logged in successfully.');
    history.push('/auth/welcome-page');
  } catch (error) {
    if (error.response.status === 401) {
      yield put(
        actions.signInError({
          message: error.message,
          status: error.response.status,
        }),
      );
      Modal.confirm({
        content: 'Please check you email and confirm your registration.',
      });
    } else if (error.response.status === 404) {
      yield put(
        actions.signInError({
          message: error.message,
          status: error.response.status,
        }),
      );
      Modal.confirm({
        content: 'Invalid email or password.',
      });
    } else {
      yield put(
        actions.signInError({
          message: error.message,
          status: error.response.status,
        }),
      );
      message.error(error.message);
    }
  }
}

export function* signInSaga() {
  yield all([takeLatest(actions.signInRequest.type, signIn)]);
}
