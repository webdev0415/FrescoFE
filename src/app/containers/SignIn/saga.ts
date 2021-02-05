import { all, put, takeLatest } from 'redux-saga/effects';
import { message, Modal } from 'antd';
import axios from 'axios';

import { actions } from './slice';
import { actions as globalActions } from '../../slice';
import Auth from 'services/Auth';
import { parseApiError } from '../../../utils/common';

export function* signIn(action) {
  try {
    const { payload } = action;
    const { history } = payload;
    const response = yield axios.post('auth/login', payload.data);
    yield put(actions.signInSuccess(response.data));
    yield put(globalActions.setAuthInformation(response.data));
    localStorage.setItem('authInformation', JSON.stringify(response.data));
    message.success('Logged in successfully.');

    Auth.setToken(response?.data?.token?.accessToken);
    Auth.update();

    // check if have invitation type
    const tokenVerifyJson = localStorage.getItem('tokenVerify');
    if (tokenVerifyJson) {
      localStorage.removeItem('tokenVerify');
      try {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response?.data?.token?.accessToken}`;
        const res = yield axios.post('invitation-type/request', {
          token: JSON.parse(tokenVerifyJson).tokenVerify,
          history,
        });
        console.log('res', res);
        if (res?.data?.typeId) {
          history.push(`/${res?.data?.type}/${res?.data?.typeId}`, {
            orgId: res?.data?.orgId,
          });
        }
        message.success('Invitation successfully.');
      } catch (e) {
        history.push('/');
        message.error(`Invitation : ${parseApiError(e).message}`);
      }
    } else {
      history.push('/');
    }
  } catch (error) {
    const errorResponse = parseApiError(error);
    if (errorResponse.statusCode === 401) {
      yield put(
        actions.signInError({
          message: errorResponse.message,
          status: errorResponse.statusCode,
        }),
      );
      Modal.confirm({
        content: 'Please check you email and confirm your registration.',
      });
    } else if (error.response.status === 404) {
      yield put(
        actions.signInError({
          message: errorResponse.message,
          status: errorResponse.statusCode,
        }),
      );
      Modal.confirm({
        content: 'Invalid email or password.',
      });
    } else {
      yield put(
        actions.signInError({
          message: errorResponse.message,
          status: errorResponse.statusCode,
        }),
      );
      message.error(error.message);
    }
  }
}

export function* signInSaga() {
  yield all([takeLatest(actions.signInRequest.type, signIn)]);
}
