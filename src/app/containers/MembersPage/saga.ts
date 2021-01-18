import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

export function* getWorkspaceMembers(action) {
  const { payload } = action;
  const { orgId, token } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.get('organization/' + orgId.id + '/members');
    yield put(actions.getWorkspaceMembersSuccess(response.data));
  } catch (error) {
    yield put(
      actions.getWorkspaceMembersError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* workspaceMembersSaga() {
  yield all([
    takeLatest(actions.getWorkspaceMembersRequest.type, getWorkspaceMembers),
  ]);
}
