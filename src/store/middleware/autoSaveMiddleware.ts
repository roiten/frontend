import { type Middleware } from "@reduxjs/toolkit";
import {
    updatePresentationDocument,
} from "../appWrite/api";
import type { Editor } from "../types";

let saveTimeout: number | null = null;

export const autoSaveMiddleware: Middleware<{}, Editor> =
    (store) => (next) => async (action) => {
        const prevState = store.getState();
        const result = next(action);
        const currState = store.getState();

        const { present: prev } = prevState;
        const { present: curr } = currState;

        const slidesChanged = curr.slides !== prev.slides;
        const metaChanged = curr.meta !== prev.meta;
        const presentationId = curr.meta.presentationId;

        if ((slidesChanged || metaChanged) && presentationId != "") {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }

            saveTimeout = window.setTimeout(() => {
                saveTimeout = null;
                console.log("Данные отправлены на сервер");
                updatePresentationDocument(presentationId, curr).catch((err) =>
                    console.error("Ошибка автосохранения:", err),
                );
            }, 5000);
        }

        return result;
    };
