import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../store';
import { setAll as setSlides } from '../reducers/slidesReducer';
import { set as setSelection } from '../reducers/selectionReducer';
import { set as setPresentation } from '../reducers/presentationReducer';
import { undo as historyUndo, redo as historyRedo } from '../reducers/historyReducer';

export const historyActions = {
    undo: createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
        'history/undo',
        (_, { getState, dispatch }) => {
            const state = getState();
            if (state.history.past.length === 0) return;
            const snapshot = state.history.past[state.history.past.length - 1];
            const { editor } = snapshot;

            dispatch(setSlides(editor.slides));
            dispatch(setSelection({
                currentSlide: editor.currentSlide,
                selectedObjects: editor.selectedObjects,
            }));
            dispatch(setPresentation({
                title: editor.title,
                author: editor.author,
                createdAt: editor.createdAt,
                editedAt: editor.editedAt,
            }));
            dispatch(historyUndo());
        }
    ),

    redo: createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
        'history/redo',
        (_, { getState, dispatch }) => {
            const state = getState();
            if (state.history.future.length === 0) return;
            const snapshot = state.history.future[0];
            const { editor } = snapshot;

            dispatch(setSlides(editor.slides));
            dispatch(setSelection({
                currentSlide: editor.currentSlide,
                selectedObjects: editor.selectedObjects,
            }));
            dispatch(setPresentation({
                title: editor.title,
                author: editor.author,
                createdAt: editor.createdAt,
                editedAt: editor.editedAt,
            }));
            dispatch(historyRedo());
        }
    ),
};