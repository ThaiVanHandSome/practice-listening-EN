import { configureStore } from '@reduxjs/toolkit';
// import wordsReducer from './Reducers/words';
import stateDayReducer from './Reducers/stateDay';

export const store = configureStore({
    reducer: {
        stateDayReducer,
    },
});
