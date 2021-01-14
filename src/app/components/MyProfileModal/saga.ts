import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

// import { actions as globalActions } from '../../slice';

export function* updateProfile(action) {
  const { payload } = action;
  const { data, token } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.put('users/me', {
      firstName: data.firstname,
      lastName: data.lastname,
      about: data.aboutme,
      avatar: data.avatar,
    });
    yield put(actions.updateProfileSuccess(response.data));
    message.success('Updated your profile successfully.');
  } catch (error) {
    yield put(
      actions.updateProfileError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* uploadAvatar(action) {
  const { payload } = action;
  const { token } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.post('upload/image/avatar');
    yield put(actions.uploadAvatarSuccess(response.data));
    message.success('Uploaded the avatar image successfully.');
  } catch (error) {
    yield put(
      actions.uploadAvatarError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* updateProfileSaga() {
  yield all([
    takeLatest(actions.updateProfileRequest.type, updateProfile),
    takeLatest(actions.uploadAvatarRequest.type, uploadAvatar),
  ]);
}
