import { combineReducers } from "@reduxjs/toolkit";
import presentationReducer from "./presentationReducer";
import slidesReducer from "./slidesReducer";
import selectionReducer from "./selectionReducer";

const editorReducer = combineReducers({
    meta: presentationReducer,
    slides: slidesReducer,
    selection: selectionReducer,
});

export default editorReducer;