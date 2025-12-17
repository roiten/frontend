import { type Middleware } from "@reduxjs/toolkit";
import { updateMetaData } from "../reducers/presentationReducer";
import type { RootState } from "../types";

const updateMetadataMiddleware: Middleware<{}, RootState> =
    (store) => (next) => (action) => {
        const prev = store.getState().editor.present;
        const result = next(action);
        const curr = store.getState().editor.present;

        if (curr.slides !== prev.slides) {
            store.dispatch(updateMetaData());
        }

        return result;
    };

export { updateMetadataMiddleware };
