import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the BoardList container
export const initialState: ContainerState = {
  loading: false,
  boardList: [],
};

const boardListSlice = createSlice({
  name: 'boardList',
  initialState,
  reducers: {
    attemptGetBoards(state, action) {
      state.loading = true;
    },
    getBoardsSuccess(state, action: PayloadAction<any>) {
      state.boardList = action.payload;
      state.loading = false;
    },
    getBoardsFail(state, action: PayloadAction<any>) {
      state.boardList = action.payload;
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = boardListSlice;
