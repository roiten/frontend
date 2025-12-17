import type { Reducer, UnknownAction } from "redux";
import type { Editor, Presentation } from "../types";

const UNDO = "history/UNDO";
const REDO = "history/REDO";
const HISTORY_SIZE = 50;

const undo = () => ({ type: UNDO });
const redo = () => ({ type: REDO });

function undoableReducer(reducer: Reducer<Presentation, UnknownAction>) {
    // const initialPresentation: Presentation = {
    //     meta: {
    //         title: "New Presentation",
    //         author: "",
    //         presentationId: "",
    //         createdAt: Date.now(),
    //         editedAt: Date.now(),
    //     },
    //     slides: [
    //         {
    //             id: "",
    //             background: { type: "color", color: "white" },
    //             content: [],
    //         },
    //     ],
    //     selection: {
    //         currentSlide: null,
    //         selectedObjects: null,
    //     },
    // };

    const initialPresentation = reducer(undefined, { type: "@@INIT" });

    const undoableInitialState: Editor = {
        past: [],
        present: initialPresentation,
        future: [],
    };

    return function undoableReducer(
        state = undoableInitialState,
        action: UnknownAction,
    ): Editor {
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
                if (
                    newPresent.slides === present.slides &&
                    newPresent.meta.title === present.meta.title
                ) {
                    return {
                        ...state,
                        present: newPresent,
                    };
                }

                const newPast = [...past, present];
                if (newPast.length > HISTORY_SIZE) {
                    newPast.shift();
                }

                return {
                    past: newPast,
                    present: newPresent,
                    future: [],
                };
            }
        }
    };
}

export { undoableReducer, undo, redo, UNDO, REDO };
