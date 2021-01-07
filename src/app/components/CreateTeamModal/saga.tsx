import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

export function* createTeam(action) {
  const { payload } = action;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
    const response = yield axios.get(
      `/users/search?keyword=${payload.keyword}`,
    );
    console.log('response', response);
    yield put(actions.createTeamSuccess(response.data));
  } catch (error) {
    yield put(actions.createTeamRequestError());
    message.error(error.message);
  }
}

export function* createTeamModalSaga() {
  yield all([takeLatest(actions.createTeamRequest.type, createTeam)]);
}
