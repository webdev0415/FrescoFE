import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';

import { actions } from './slice';

export function* createWorkspace(action) {
  const { payload } = action;
  const { data, token, slug } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.post('organization/', {
      name: data.workspacename,
      slug: slug,
    });

    yield put(actions.createWorkspaceRequestSuccess(response.data));
    message.success('Created new workspace successfully.');
  } catch (error) {
    yield put(actions.createWorkspaceRequestError());
    message.error(
      error?.response?.data?.message ?? 'There is an issue on our side',
    );
  }
}

export function* createWorkspaceSaga() {
  yield all([takeLatest(actions.createWorkspaceRequest.type, createWorkspace)]);
}
