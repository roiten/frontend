import type { Middleware, Action } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { HistorySnapshot } from "../types";
import { savePast } from "../reducers/historyReducer";

const SYSTEM_ACTION_TYPES = [
    "presentation/set",
    "slides/set",
    "selection/set",
    "history/restoreState",
    "history/savePast",
    "history/undo",
    "history/redo",
] as const;

type SystemActionType = (typeof SYSTEM_ACTION_TYPES)[number];

function isSystemAction(action: Action): action is Action<SystemActionType> {
    return (SYSTEM_ACTION_TYPES as readonly string[]).includes(action.type);
}

export const historyMiddleware: Middleware<object, RootState> =
    (api) => (next) => (action) => {
        if (isSystemAction(action as Action)) {
            return next(action);
        }

        const prevState = api.getState();
        const result = next(action);
        const nextState = api.getState();

        if (prevState.slides !== nextState.slides) {
            console.log("[HISTORY] saved snapshot for:", action);

            const snapshot: HistorySnapshot = {
                editor: {
                    title: nextState.presentation.title,
                    slides: [...nextState.slides],
                    currentSlide: nextState.selection.currentSlide,
                    selectedObjects: nextState.selection.selectedObjects,
                    author: nextState.presentation.author,
                    createdAt: nextState.presentation.createdAt,
                    editedAt: nextState.presentation.editedAt,
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