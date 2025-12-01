import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import presentationReducer from './reducers/presentationReducer';
import slidesReducer from './reducers/slidesReducer';
import selectionReducer from './reducers/selectionReducer';
import historyReducer from './reducers/historyReducer';
import { historyMiddleware } from './middleware/historyMiddleware';
import { restoreStateMiddleware } from './middleware/restoreStateMiddleware';
import type { Editor } from "./types.ts";

const historyMiddlewareTyped: Middleware<object, Editor> = historyMiddleware;
const restoreStateMiddlewareTyped: Middleware<object, Editor> = restoreStateMiddleware;

export const store = configureStore({
    reducer: {
        meta: presentationReducer,
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
        }).concat(historyMiddlewareTyped, restoreStateMiddlewareTyped),
});

export type AppDispatch = typeof store.dispatch;