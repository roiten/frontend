import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { HistorySnapshot } from '../types';
import { savePast } from '../reducers/historyReducer';

export const historyMiddleware: Middleware<object, RootState> = (api) => (next) => (action) => {
    const { getState, dispatch } = api;

    if (
        typeof action === 'object' &&
        action !== null &&
        'type' in action &&
        typeof action.type === 'string' &&
        (
            action.type.startsWith('@@') ||
            action.type.startsWith('history/') ||
            action.type.startsWith('persist/') ||
            action.type === 'REHYDRATE' ||

            action.type.includes('/set') ||
            action.type.includes('/setAll') ||
            action.type === 'slides/setAll' ||
            action.type === 'selection/set' ||
            action.type === 'presentation/set'
        )
    ) {
        return next(action);
    }

    const prevState = getState();

    const result = next(action);
    const nextState = getState();
    const stateChanged = prevState !== nextState;

    if (stateChanged) {
        const snapshot: HistorySnapshot = {
            editor: {
                title: nextState.presentation.title,
                slides: [...nextState.slides],
                currentSlide: nextState.selection.currentSlide,
                selectedObjects: nextState.selection.selectedObjects,
                author: nextState.presentation.author,
                createdAt: nextState.presentation.createdAt,
                editedAt: nextState.presentation.editedAt,
            },
            contextBefore: {
                currentSlide: prevState.selection.currentSlide,
                selectedObjects: prevState.selection.selectedObjects,
            },
        };
        dispatch(savePast(snapshot));
    }
    return result;
};