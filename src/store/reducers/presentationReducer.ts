import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createDefaultPresentation } from "../default";
import type { MetaData } from "../types";

const defaultPres = createDefaultPresentation();

const presentationReducer = createSlice({
    name: "meta",
    initialState: {
        title: defaultPres.present.meta.title,
        author: defaultPres.present.meta.author,
        createdAt: defaultPres.present.meta.createdAt,
        editedAt: defaultPres.present.meta.editedAt,
    },
    reducers: {
        setPresentationTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
            state.editedAt = Date.now();
        },
        set(_, action: PayloadAction<MetaData>) {
            return action.payload
        },
    },
});

export const { setPresentationTitle, set } = presentationReducer.actions;
export default presentationReducer.reducer;
