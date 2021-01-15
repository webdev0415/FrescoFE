import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the SelectOrganizationPage container
export const initialState: ContainerState = {
  loading: false,
};

const createWorkspaceSlice = createSlice({
  name: 'createWorkspace',
  initialState,
  reducers: {
    createWorkspaceRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    createWorkspaceRequestSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    createWorkspaceRequestError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = createWorkspaceSlice;
