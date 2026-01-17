import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreloaderState {
  isPreloaderLoaded: boolean;
}

const initialState: PreloaderState = {
  isPreloaderLoaded: false,
};

const preloaderSlice = createSlice({
  name: 'preloaderSlice',
  initialState,
  reducers: {
    setIsPreloaderLoaded: (state, action: PayloadAction<boolean>) => {
      state.isPreloaderLoaded = action.payload;
    },
  },
});

export const { setIsPreloaderLoaded } = preloaderSlice.actions;
export default preloaderSlice.reducer;