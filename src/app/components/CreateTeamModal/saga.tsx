import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

export function* createTeam(action) {
  const { payload } = action;
  const { data, token, orgId } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.post('teams/', {
      name: data.teamname,
      orgId: orgId.id,
      users: data.teammembers,
    });
    yield put(actions.createTeamSuccess(response.data));
  } catch (error) {
    yield put(actions.createTeamRequestError());
    message.error(error.message);
  }
}

export function* createTeamSaga() {
  yield all([takeLatest(actions.createTeamRequest.type, createTeam)]);
}
