import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./reducers/editorReducer";
import { undoableReducer } from "./reducers/undoableReducer";
import authReducer from "./reducers/authReducer";
import { autoSaveMiddleware } from "./middleware/autoSaveMiddleware";
import { updateMetadataMiddleware } from "./middleware/updateMetadataMiddleware";
import { useDispatch, useSelector } from "react-redux";

const undoableEditorReducer = undoableReducer(editorReducer);

const store = configureStore({
    reducer: {
        editor: undoableEditorReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            updateMetadataMiddleware,
            autoSaveMiddleware,
        ),
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;


const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector = useSelector.withTypes<RootState>();

export {
    store,
    useAppDispatch,
    useAppSelector,

    type AppDispatch,
    type RootState,
}