// ./store/store.ts

import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./reducers/editorReducer";
import { undoable } from "./undoable";
import { useDispatch, useSelector } from "react-redux";

// Оборачиваем editorReducer в undoable
const undoableEditorReducer = undoable(editorReducer);

export const store = configureStore({
    reducer: undoableEditorReducer,
    // serializableCheck можно оставить или убрать — immer работает корректно
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();