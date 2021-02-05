import { all, put, takeEvery } from 'redux-saga/effects';
import { message } from 'antd';
import { actions } from './slice';
import axios from 'axios';
import Auth from 'services/Auth';
import { parseApiError } from '../../../utils/common';
axios.defaults.headers.common['Authorization'] = `Bearer ${Auth.getToken()}`;

// import { actions as globalActions } from '../../slice';
export function* getBoards(action) {
  const { payload } = action;

  try {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${Auth.getToken()}`;
    let queryParams = `${payload.orgId}`;
    if (payload.teamId) {
      queryParams = queryParams + `?teamId=${payload.teamId}`;
    }
    const response = yield axios.get(`/board/organization/${queryParams}`);

    yield put(actions.getBoardsSuccess(response.data));
  } catch (error) {
    yield put(actions.getBoardsFail());
    message.error(parseApiError(error).message);
  }
}

export function* boardListSaga() {
  yield all([takeEvery(actions.attemptGetBoards.type, getBoards)]);
}
