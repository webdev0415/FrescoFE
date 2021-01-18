import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the ListOrg container
export const initialState: ContainerState = {
  members: [],
  loading: false,
};

const workspaceMembersSlice = createSlice({
  name: 'workspaceMembers',
  initialState,
  reducers: {
    getWorkspaceMembersRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    getWorkspaceMembersSuccess(state, action: PayloadAction<any>) {
      state.members = action.payload;
      state.loading = false;
    },

    getWorkspaceMembersError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = workspaceMembersSlice;
