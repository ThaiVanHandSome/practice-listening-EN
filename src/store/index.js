import { configureStore } from '@reduxjs/toolkit';
import wordsReducer from './Reducers/words';

export const store = configureStore({
    reducer: {
        wordsReducer,
    },
});
