import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createDefaultPresentation } from "../default";
import type { MetaData } from "../types";

const defaultPres = createDefaultPresentation();

const initialState: MetaData = {
  title: defaultPres.present.meta.title,
  author: defaultPres.present.meta.author,
  presentationId: defaultPres.present.meta.presentationId,
  createdAt: defaultPres.present.meta.createdAt,
  editedAt: defaultPres.present.meta.editedAt,
};

const presentationReducer = createSlice({
  name: "meta",
  initialState,
  reducers: {
    setPresentationTitle(state, action: PayloadAction<string>) {
      return { ...state, title: action.payload, editedAt: Date.now() };
    },
    set(_, action: PayloadAction<MetaData>) {
      return action.payload;
    },
    setPresentationId(state, action: PayloadAction<string>) { 
      return { ...state, presentationId: action.payload }; 
    },
  },
});

export const { setPresentationTitle, set, setPresentationId } = presentationReducer.actions;
export default presentationReducer.reducer;