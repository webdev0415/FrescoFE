import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the ListOrg container
export const initialState: ContainerState = {
  loading: false,
};

const myProfileModalSlice = createSlice({
  name: 'myProfileModal',
  initialState,
  reducers: {
    updateProfileRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    updateProfileSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    updateProfileError(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    uploadAvatarRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    uploadAvatarSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    uploadAvatarError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = myProfileModalSlice;
