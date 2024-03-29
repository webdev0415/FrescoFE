import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the SelectOrganizationPage container
export const initialState: ContainerState = {
  workspaceMembers: [],
  loading: false,
};

const createTeamModalSlice = createSlice({
  name: 'createTeam',
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

    getWorkspaceMembersRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    getWorkspaceMembersSuccess(state, action: PayloadAction<any>) {
      state.workspaceMembers = action.payload;
      state.loading = false;
    },

    getWorkspaceMembersError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = createTeamModalSlice;
