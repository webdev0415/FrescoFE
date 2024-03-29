import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';
import { parseApiError } from '../../../utils/common';

export function* createTeam(action) {
  const { payload } = action;
  const { data, token, orgId } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.post('teams/', {
      name: data.teamname,
      orgId: orgId.orgId,
      users: data.teammembers,
    });
    yield put(actions.createTeamSuccess(response.data));
  } catch (error) {
    yield put(actions.createTeamRequestError());
    message.error(parseApiError(error).message);
  }
}

export function* getWorkspaceMembers(action) {
  const { payload } = action;
  const { orgId, token } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.get(
      'organization/' + orgId.orgId + '/members',
    );
    yield put(actions.getWorkspaceMembersSuccess(response.data));
  } catch (error) {
    yield put(
      actions.getWorkspaceMembersError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(parseApiError(error).message);
  }
}

export function* createTeamSaga() {
  yield all([
    takeLatest(actions.createTeamRequest.type, createTeam),
    takeLatest(actions.getWorkspaceMembersRequest.type, getWorkspaceMembers),
  ]);
}
