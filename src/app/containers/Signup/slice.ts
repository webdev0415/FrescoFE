import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the Signup container
export const initialState: ContainerState = {
  token: null,
  loading: false,
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    signUpRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    signUpSuccess(state) {
      state.loading = false;
    },

    signUpError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = signupSlice;
