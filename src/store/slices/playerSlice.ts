import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  currentIndex: number;
  isPaused: boolean;
}

const initialState: PlayerState = {
  currentIndex: 0,
  isPaused: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },
    setPaused(state, action: PayloadAction<boolean>) {
      state.isPaused = action.payload;
    },
  },
});

export const { setCurrentIndex, setPaused } = playerSlice.actions;
export default playerSlice.reducer;
