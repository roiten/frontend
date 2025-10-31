import { useState, useEffect } from "react";
import { dispatch, getEditor } from "../../../../store/editor";
import { moveSlide } from "../../../../store/actions.ts";

export function useSlideMove() {
    const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    const handleDragStart = (slideId: string) => {
        setDraggedSlideId(slideId);
        setDropIndex(null);
    };

    const handleDragOver = (index: number) => {
        if (!draggedSlideId) return;

        const editor = getEditor();
        const fromIndex = editor.slides.findIndex(s => s.id === draggedSlideId);
        if (fromIndex === -1) return;

        if (index === fromIndex || index === fromIndex + 1) {
            setDropIndex(null);
            return;
        }

        setDropIndex(index);
    };

    const handleDrop = () => {
        if (draggedSlideId === null || dropIndex === null) {
            cleanSelectedStates();
            return;
        }
        dispatch(moveSlide, draggedSlideId, dropIndex);
        cleanSelectedStates();
    };

    const cleanSelectedStates = () => {
        setDraggedSlideId(null);
        setDropIndex(null);
    };

    useEffect(() => {
        if (draggedSlideId !== null) {
            window.addEventListener("mouseup", () => handleDrop());
            return () => window.removeEventListener("mouseup", () => handleDrop());
        }
    }, [draggedSlideId, dropIndex]);

    return {
        dropIndex,
        isDragging: draggedSlideId !== null,
        handleDragStart,
        handleDragOver,
    };
}