import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

// import { actions as globalActions } from '../../slice';

export function* updateWorkspace(action) {
  const { payload } = action;
  const { data, token, orgId } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.put('organization/' + orgId, {
      name: data.workspacename,
      slug: data.workspacedomain,
      avatar: data.avatar,
    });
    yield put(actions.updateWorkspaceSuccess(response.data));
    message.success('Updated workspace successfully.');
  } catch (error) {
    yield put(
      actions.updateWorkspaceError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* updateWorkspaceSaga() {
  yield all([takeLatest(actions.updateWorkspaceRequest.type, updateWorkspace)]);
}