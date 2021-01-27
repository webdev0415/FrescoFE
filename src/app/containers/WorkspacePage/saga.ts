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

export function* deleteWorkspace(action) {
  const { payload } = action;
  const { token, orgId } = payload;

  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.delete('organization/' + orgId);
    yield put(actions.deleteWorkspaceSuccess(response.data));
    message.success('deleted workspace successfully.');
  } catch (error) {
    yield put(
      actions.deleteWorkspaceError({
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

export function* deleteWorkspaceSaga() {
  yield all([takeLatest(actions.deleteWorkspaceRequest.type, deleteWorkspace)]);
}
