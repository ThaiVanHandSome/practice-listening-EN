import { createSlice } from '@reduxjs/toolkit';
import getData from '~/data/vocabularySource';

const initialState = await getData();

const wordsSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {},
});

const wordsReducer = wordsSlice.reducer;
export default wordsReducer;
