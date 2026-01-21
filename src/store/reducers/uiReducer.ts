import { createSlice } from "@reduxjs/toolkit";

const uiReducer = createSlice({
    name: 'ui',
    initialState: {
        showHistoryPanel: false,
        activePresentationVersoinId: "",
    },
    reducers: {
        toggleHistoryPanel: (state) => {
            state.showHistoryPanel = !state.showHistoryPanel;
        },
        setHistoryPanel: (state, action) => {
            state.showHistoryPanel = action.payload;
        },
        setActivePresentationVersoinId: (state, action) => {
            state.activePresentationVersoinId = action.payload
        }

    }
});

export const { toggleHistoryPanel, setHistoryPanel, setActivePresentationVersoinId } = uiReducer.actions;
export default uiReducer.reducer;