import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { restoreState } from './actions/historyActions';
import type { Editor } from '../types';

export const restoreStateMiddleware: Middleware<object, RootState> = (api) => (next) => (action) => {
    if (restoreState.match(action)) {
        const editor: Editor = action.payload;

        api.dispatch({ type: 'presentation/set', payload: editor });
        api.dispatch({ type: 'slides/set', payload: editor });
        api.dispatch({ type: 'selection/set', payload: editor });

        return next(action);
    }

    return next(action);
};