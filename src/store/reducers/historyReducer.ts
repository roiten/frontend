import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HistoryState, HistorySnapshot } from '../types';

const initialState: HistoryState = {
    past: [],
    future: [],
};

const historyReducer = createSlice({
    name: 'history',
    initialState,
    reducers: {
        savePast(state, action: PayloadAction<HistorySnapshot>) {
            state.past.push(action.payload);
            state.future = [];
            if (state.past.length > 50) state.past.shift();
        },
        undo(state) {
            if (state.past.length === 0) return;
            const last = state.past.pop()!;
            state.future.unshift(last);
        },
        redo(state) {
            if (state.future.length === 0) return;
            const next = state.future.shift()!;
            state.past.push(next);
        },
        clearHistory(state) {
            state.past = [];
            state.future = [];
        },
    },
});

export const { savePast, undo, redo, clearHistory } = historyReducer.actions;
export default historyReducer.reducer;