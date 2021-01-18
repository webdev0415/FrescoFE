import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the ListOrg container
export const initialState: ContainerState = {
  teamMenu: [],
  loading: false,
};

const teamMenuSlice = createSlice({
  name: 'teamMenu',
  initialState,
  reducers: {
    getTeamMenuRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    getTeamMenuSuccess(state, action: PayloadAction<any>) {
      state.teamMenu = action.payload;
      state.loading = false;
    },

    getTeamMenuError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = teamMenuSlice;
