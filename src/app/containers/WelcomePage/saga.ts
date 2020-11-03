import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';

import { actions } from './slice';
import { actions as globalActions } from '../../slice';

export function* signIn(action) {
  try {
    const { payload } = action;
    const { token, history } = payload;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.get('auth/me');
    yield put(actions.signInSuccess(response.data));
    const authInfo = {
      user: response.data,
      token: { accessToken: token },
    };
    yield put(globalActions.setAuthInformation(authInfo));
    localStorage.setItem('authInformation', JSON.stringify(authInfo));
    message.success('Logged in successfully.');
    history.push('/auth/welcome-page');
  } catch (error) {
    message.error(error.message);
    yield put(actions.signInError());
  }
}

export function* welcomePageSaga() {
  yield all([takeLatest(actions.signInRequest.type, signIn)]);
}
