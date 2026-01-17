import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeSliceReducer from './theme/themeSlice';
import preloaderSliceReducer from './animation/preloaderSlice';
import flipboardSliceReducer from './animation/flipboardSlice';

// 1. Combine Reducers directly
const rootReducer = combineReducers({
  themeSlice: themeSliceReducer,
  preloaderSlice: preloaderSliceReducer,
  flipboardSlice: flipboardSliceReducer,
});

// 2. Configure Store without Persistence
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for smoother non-persistent state
    }),
});

// Types for TypeScript usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;