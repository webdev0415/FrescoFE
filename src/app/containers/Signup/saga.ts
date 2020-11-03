import { all, put, takeLatest } from 'redux-saga/effects';
import { message, Modal } from 'antd';
import axios from 'axios';

import { actions } from './slice';

export function* signUp(action) {
  try {
    const { payload } = action;
    const { data, history } = payload;
    yield axios.post('auth/register', data);
    yield put(actions.signUpSuccess());
    message.success(`You're registered successfully.`);
    history.push('/auth/check-email');
  } catch (error) {
    if (error.response.status === 409) {
      Modal.confirm({
        content:
          'User already exists with this email, please try again with different email address.',
      });
    } else {
      message.error(error.message);
    }
    yield put(actions.signUpError());
  }
}
export function* signupSaga() {
  yield all([takeLatest(actions.signUpRequest.type, signUp)]);
}
