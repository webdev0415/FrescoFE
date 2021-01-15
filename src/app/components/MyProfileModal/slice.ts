import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the ListOrg container
export const initialState: ContainerState = {
  myProfile: null,
  loading: false,
};

const myProfileModalSlice = createSlice({
  name: 'myProfile',
  initialState,
  reducers: {
    updateProfileRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    updateProfileSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.myProfile = action.payload;
    },

    updateProfileError(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    getProfileDataRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    getProfileDataSuccess(state, action: PayloadAction<any>) {
      state.myProfile = action.payload;
      state.loading = false;
    },

    getProfileDataError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = myProfileModalSlice;
