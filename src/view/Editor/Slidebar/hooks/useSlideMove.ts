import { useState, useEffect, useCallback, useRef } from "react";
import { dispatch, getEditor } from "../../../../store/editor";
import { moveSlide } from "../../../../store/actions.ts";

export function useSlideMove() {
    const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    const lastHoverIndex = useRef<number | null>(null);

    const cleanSelectedStates = useCallback(() => {
        setDraggedSlideId(null);
        setDropIndex(null);
        lastHoverIndex.current = null;
    }, []);

    const handleDrop = useCallback(() => {
        if (draggedSlideId && dropIndex !== null) {
            dispatch(moveSlide, draggedSlideId, dropIndex);
        }
        cleanSelectedStates();
    }, [draggedSlideId, dropIndex, cleanSelectedStates]);

    const handleDragStart = (slideId: string) => {
        setDraggedSlideId(slideId);
        setDropIndex(null);
    };

    const handleDragOver = (index: number) => {
        const editor = getEditor();
        if (!draggedSlideId) return;
        const startIndex = editor.slides.findIndex((s) => s.id === draggedSlideId);
        if (startIndex === -1) return;
        const prevHover = lastHoverIndex.current;
        let newIndex = index;

        if (prevHover !== null) {
            if (index > prevHover) {
                newIndex = index + 1;
            } else if (index < prevHover) {
                newIndex = index;
            }
        }

        lastHoverIndex.current = index;
        setDropIndex(newIndex);
    };

    useEffect(() => {
        if (!draggedSlideId) return;

        const onMouseUp = () => handleDrop();

        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [draggedSlideId, handleDrop]);

    return {
        dropIndex,
        draggedSlideId,
        isDragging: draggedSlideId !== null,
        handleDragStart,
        handleDragOver,
    };
}
