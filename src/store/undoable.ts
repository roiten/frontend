import type { Reducer, UnknownAction } from "redux";
import type {
    MetaData,
    Slide,
    Selection,
} from "./types";

//убрать!
export type PresentState = {
    meta: MetaData;
    slides: Slide[];
    selection: Selection;
};

export const UNDO = "history/UNDO";
export const REDO = "history/REDO";

export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });

export function undoable<S extends PresentState>(
    reducer: Reducer<S, UnknownAction>,
) {
    const initialState = reducer(undefined, { type: "@@INIT" });

    type UndoableState = {
        past: S[];
        present: S;
        future: S[];
    };

    const undoableInitialState: UndoableState = {
        past: [],
        present: initialState,
        future: [],
    };

    return function undoableReducer(
        state = undoableInitialState,
        action: UnknownAction,
    ): UndoableState {
        const { past, present, future } = state;

        switch (action.type) {
            case UNDO: {
                if (past.length === 0) return state;
                const previous = past[past.length - 1];
                const newPast = past.slice(0, -1);
                return {
                    past: newPast,
                    present: previous,
                    future: [present, ...future],
                };
            }

            case REDO: {
                if (future.length === 0) return state;
                const next = future[0];
                const newFuture = future.slice(1);
                return {
                    past: [...past, present],
                    present: next,
                    future: newFuture,
                };
            }

            default: {
                const newPresent = reducer(present, action);

                const onlySelectionChanged = (
                    newPresent !== present &&
                    newPresent.meta === present.meta &&
                    newPresent.slides === present.slides &&
                    newPresent.selection !== present.selection
                );

                if (newPresent === present || onlySelectionChanged) {
                    return {
                        ...state,
                        present: newPresent,
                    };
                }

                return {
                    past: [...past, present],
                    present: newPresent,
                    future: [],
                };
            }
        }
    };
}