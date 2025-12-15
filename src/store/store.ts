import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./reducers/editorReducer";
import { undoable } from "./reducers/undoable";
import { useDispatch, useSelector } from "react-redux";
import { autoSaveMiddleware } from "./middleware/autoSaveMiddleware";

const undoableEditorReducer = undoable(editorReducer);

export const store = configureStore({
    reducer: undoableEditorReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(autoSaveMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
