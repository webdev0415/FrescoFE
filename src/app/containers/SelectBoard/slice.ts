import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the SelectBoard container
export const initialState: ContainerState = {
  loading: false,
  canvases: [],
};

const selectBoardSlice = createSlice({
  name: 'selectBoard',
  initialState,
  reducers: {
    selectBoardRequest(state, action) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    selectBoardRequestSuccess(state, action) {
      state.loading = false;
      state.canvases = action.payload;
    },

    selectBoardRequestError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = selectBoardSlice;
