import type { Action, Middleware } from "@reduxjs/toolkit";
import type { Editor, HistorySnapshot } from "../types";
import { savePast } from "../reducers/historyReducer";

const SYSTEM_ACTION_TYPES = [
    "presentation/set",
    "slides/set",
    "selection/set",
    "history/restoreState",
    "history/savePast",
    "history/undo",
    "history/redo",
];

function isSystemAction(action: { type: string }): boolean {
    return SYSTEM_ACTION_TYPES.includes(action.type);
}

export const historyMiddleware: Middleware<object, Editor> =
    (api) => (next) => (action) => {
        if (isSystemAction(action as Action)) {
            return next(action);
        }

        const prevState = api.getState();
        const result = next(action);
        const nextState = api.getState();

        if (
            prevState.slides !== nextState.slides ||
            prevState.meta !== nextState.meta
        ) {
            const snapshot: HistorySnapshot = {
                editor: {
                    meta: { ...nextState.meta },
                    slides: [...nextState.slides],
                    selection: { ...nextState.selection },
                },
                contextBefore: {
                    currentSlide: prevState.selection.currentSlide,
                    selectedObjects: prevState.selection.selectedObjects,
                },
            };

            api.dispatch(savePast(snapshot));
        }

        return result;
    };