import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../../store.ts';
import { undo as historyUndo, redo as historyRedo } from '../../reducers/historyReducer.ts';
import type { Editor } from '../../types.ts';

const restoreState = createAction<Editor>('history/restoreState');

const undo = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
    'history/undo',
    (_, { getState, dispatch }) => {
        const state = getState();
        const snapshots = state.history.past;
        if (snapshots.length === 0) return;

        const snapshot = snapshots[snapshots.length - 1];
        dispatch(restoreState(snapshot.editor));
        dispatch(historyUndo());
    }
);

const redo = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
    'history/redo',
    (_, { getState, dispatch }) => {
        const state = getState();
        const snapshots = state.history.future;
        if (snapshots.length === 0) return;

        const snapshot = snapshots[0];
        dispatch(restoreState(snapshot.editor));
        dispatch(historyRedo());
    }
);

export {
    undo,
    redo,
    restoreState
}