import { message } from 'antd';
import axios from 'axios';
import { put, takeEvery, all } from 'redux-saga/effects';
import Auth from 'services/Auth';
import { actions } from './slice';

// export function* doSomething() {}

function* selectBoardSaga(action) {
  const { payload } = action;

  try {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${Auth.getToken()}`;
    const response = yield axios.get(`/canvas/organization/${payload}`);
    console.log('response', response);
    yield put(actions.selectBoardRequestSuccess(response.data));
  } catch (error) {
    message.error(error.message);
  }
}

export function* selectBoardsSaga() {
  yield all([takeEvery(actions.selectBoardRequest.type, selectBoardSaga)]);
}
