import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createDefaultPresentation } from '../default';
import type { Editor } from "../types.ts";

const defaultPres = createDefaultPresentation();

const presentationReducer = createSlice({
    name: 'presentation',
    initialState: {
        title: defaultPres.title,
        author: defaultPres.author,
        createdAt: defaultPres.createdAt,
        editedAt: defaultPres.editedAt,
    },
    reducers: {
        setPresentationTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
            state.editedAt = Date.now();
        },
        openPresentation(state, action: PayloadAction<Editor>) {
            const { title, author, createdAt, editedAt } = action.payload;
            state.title = title;
            state.author = author;
            state.createdAt = createdAt;
            state.editedAt = editedAt;
        },
    },
});

export const { setPresentationTitle, openPresentation } = presentationReducer.actions;
export default presentationReducer.reducer;