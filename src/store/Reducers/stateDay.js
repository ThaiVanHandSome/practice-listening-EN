import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currIndex: 0,
    currList: [],
    start: false,
};

const stateDay = createSlice({
    name: 'stateDay',
    initialState,
    reducers: {
        updateState: (state, payload) => {
            state.currIndex = payload.index;
            state.currList = payload.list;
            state.start = payload.start;
            return state;
        },
        refeshState: (state) => {
            state.currIndex = 0;
            state.currList = [];
            state.start = false;
            return state;
        },
    },
});

const stateDayReducer = stateDay.reducer;
export default stateDayReducer;
const { updateState, refeshState } = stateDay.actions;
export { updateState, refeshState };
