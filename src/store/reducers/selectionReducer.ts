import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Selection } from "../types.ts";

const initialState: Selection = {
    currentSlide: null,
    selectedObjects: null,
};

const selectionReducer = createSlice({
    name: "selection",
    initialState,
    reducers: {
        chooseSlide(state, action: PayloadAction<string>) {
            state.currentSlide = action.payload;
        },
        addSelectedObject(state, action: PayloadAction<string>) {
            const current = state.selectedObjects || [];
            if (!current.includes(action.payload)) {
                state.selectedObjects = [...current, action.payload];
            }
        },
        removeSelectedObject(state, action: PayloadAction<string>) {
            if (state.selectedObjects) {
                const filtered = state.selectedObjects.filter(
                    (id) => id !== action.payload,
                );
                state.selectedObjects = filtered.length > 0 ? filtered : null;
            }
        },
        clearSelectedObjects(state) {
            state.selectedObjects = null;
        },
        set(state, action: PayloadAction<Selection>) {
            state.currentSlide = action.payload.currentSlide;
            state.selectedObjects = action.payload.selectedObjects;
        },
    },
});

export const {
    chooseSlide,
    addSelectedObject,
    removeSelectedObject,
    clearSelectedObjects,
    set,
} = selectionReducer.actions;

export default selectionReducer.reducer;
