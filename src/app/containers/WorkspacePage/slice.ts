import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the ListOrg container
export const initialState: ContainerState = {
  workspace: null,
  loading: false,
};

const workspacePageSlice = createSlice({
  name: 'workspacepage',
  initialState,
  reducers: {
    updateWorkspaceRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    updateWorkspaceSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.workspace = action.payload;
    },

    updateWorkspaceError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = workspacePageSlice;
