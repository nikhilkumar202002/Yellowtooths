import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FlipboardState {
  isTilesFlipped: boolean;
}

const initialState: FlipboardState = {
  isTilesFlipped: false,
};

const flipBoardSlice = createSlice({
  name: 'flipboardSlice',
  initialState,
  reducers: {
    setIsTilesFlipped: (state, action: PayloadAction<boolean>) => {
      state.isTilesFlipped = action.payload;
    },
  },
});

export const { setIsTilesFlipped } = flipBoardSlice.actions;
export default flipBoardSlice.reducer;