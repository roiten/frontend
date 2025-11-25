import { configureStore} from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import presentationReducer from './reducers/presentationReducer';
import slidesReducer from './reducers/slidesReducer';
import selectionReducer from './reducers/selectionReducer';
import historyReducer from './reducers/historyReducer';
import { historyMiddleware } from './middleware/historyMiddleware';

export type PresentationState = ReturnType<typeof presentationReducer>;
export type SlidesState = ReturnType<typeof slidesReducer>;
export type SelectionState = ReturnType<typeof selectionReducer>;
export type HistoryState = ReturnType<typeof historyReducer>;

export interface RootState {
    presentation: PresentationState;
    slides: SlidesState;
    selection: SelectionState;
    history: HistoryState;
}

const typedHistoryMiddleware: Middleware<object, RootState> = historyMiddleware;

export const store = configureStore({
    reducer: {
        presentation: presentationReducer,
        slides: slidesReducer,
        selection: selectionReducer,
        history: historyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['history/savePast'],
                ignoredPaths: ['history.past', 'history.future'],
            },
        }).concat(typedHistoryMiddleware),
});

export type AppDispatch = typeof store.dispatch;