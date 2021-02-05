import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';
import { OrganizationApiService } from '../../../../services/APIService/OrganizationApi.service';
import { TeamsApiService } from '../../../../services/APIService/TeamsApi.service';
import Auth from '../../../../services/Auth';

export function* teamMenu(action) {
  const { payload } = action;
  const { orgId } = payload;
  const token = Auth.getToken();
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.get('teams?orgId=' + orgId);
    yield put(actions.getTeamMenuSuccess(response.data));
  } catch (error) {
    yield put(
      actions.getTeamMenuError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* teamMenuSaga() {
  yield all([takeLatest(actions.getTeamMenuRequest.type, teamMenu)]);
}
