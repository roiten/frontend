import { useEffect, useCallback } from "react";
import { redo, undo } from "../../../../store/reducers/undoableReducer";
import { useAppDispatch } from "../../../../store/store";

export const useUndoRedoHotkeys = () => {
    const dispatch = useAppDispatch();

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;
            if (!isCtrlOrCmd) return;

            switch (e.key.toLowerCase()) {
                case "z":
                    e.preventDefault();
                    e.shiftKey ? dispatch(redo()) : dispatch(undo());
                    break;

                case "y":
                    e.preventDefault();
                    dispatch(redo());
                    break;

                case "я":
                    e.preventDefault();
                    e.shiftKey ? dispatch(redo()) : dispatch(undo());
                    break;

                case "н":
                    if (e.shiftKey) {
                        e.preventDefault();
                        dispatch(redo());
                    }
                    break;

                default:
                    return;
            }
        }, [],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);
};
