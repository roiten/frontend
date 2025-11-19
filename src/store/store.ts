import { configureStore } from '@reduxjs/toolkit';
import presentationReducer from './reducers/presentationReducer.ts';
import slidesReducer from './reducers/slidesReducer.ts';
import selectionReducer from './reducers/selectionReducer.ts';

export const store = configureStore({
    reducer: {
        presentation: presentationReducer,
        slides: slidesReducer,
        selection: selectionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;