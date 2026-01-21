import { type Middleware } from "@reduxjs/toolkit";
import { updatePresentationDocument } from "../appWrite/api";
import type { RootState } from "../types";

let saveTimeout: number | null = null;

const autoSaveMiddleware: Middleware<{}, RootState> =
    (store) => (next) => async (action) => {
        const prev = store.getState().editor.present;
        const result = next(action);
        const curr = store.getState().editor.present;

        const slidesChanged = curr.slides !== prev.slides;
        const metaChanged = curr.meta.title !== prev.meta.title;
        const presentationId = curr.meta.presentationId;

        if ((slidesChanged || metaChanged) && presentationId) {
            if (saveTimeout) clearTimeout(saveTimeout);

            saveTimeout = setTimeout(() => {
                saveTimeout = null;

                updatePresentationDocument(presentationId, curr)
                    .catch(console.error);
            }, 5000);
        }

        return result;
    };

export { autoSaveMiddleware };
