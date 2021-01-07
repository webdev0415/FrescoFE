import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the SelectOrganizationPage container
export const initialState: ContainerState = {
  loading: false,
};

const createTeamModalSlice = createSlice({
  name: 'createTeamModal',
  initialState,
  reducers: {
    createTeamRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    createTeamSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    createTeamRequestError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = createTeamModalSlice;
