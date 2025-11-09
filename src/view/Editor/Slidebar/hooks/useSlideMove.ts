import { useCallback, useEffect, useRef, useState } from "react";
import { dispatch } from "../../../../store/editor";
import { moveSlide } from "../../../../store/actions.ts";

export function useSlideMove(
    selectedSlidesIds: string[],
    setIsDragging: (value: boolean) => void,
) {
    const [draggedSlidesIds, setDraggedSlidesIds] = useState<string[]>([]);
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    const lastHoverIndex = useRef<number | null>(null);

    const handleDragStart = useCallback(() => {
        if (selectedSlidesIds.length > 0) {
            setDraggedSlidesIds(selectedSlidesIds);
            setDropIndex(null);
        }
    }, [selectedSlidesIds]);

    const handleDragOver = useCallback((index: number) => {
        if (draggedSlidesIds.length === 0) return;

        const prev = lastHoverIndex.current;
        let newIndex = index;

        if (prev !== null) {
            // Перемещение вниз (index > prev) → вставка ПОСЛЕ → dropIndex = index + 1
            if (index > prev) {
                newIndex = index + 1;
            }
            // Перемещение вверх (index < prev) → вставка ДО → dropIndex = index
            else if (index < prev) {
                newIndex = index;
            }
            // Если index === prev — ничего не меняем
        }

        lastHoverIndex.current = index;
        setDropIndex(newIndex);
    }, [draggedSlidesIds]);

    const handleDrop = useCallback(() => {
        if (draggedSlidesIds.length === 0 || dropIndex === null) {
            setDraggedSlidesIds([]);
            setDropIndex(null);
            lastHoverIndex.current = null;
            setIsDragging(false);
            return;
        }
        dispatch(moveSlide, draggedSlidesIds, dropIndex);

        // Сброс
        setDraggedSlidesIds([]);
        setDropIndex(null);
        lastHoverIndex.current = null;
        setIsDragging(false);
    }, [draggedSlidesIds, dropIndex, setIsDragging]);

    // Глобальный mouseup
    useEffect(() => {
        if (draggedSlidesIds.length === 0) return;

        const onMouseUp = () => handleDrop();
        window.addEventListener("mouseup", onMouseUp);
        return () => window.removeEventListener("mouseup", onMouseUp);
    }, [draggedSlidesIds, handleDrop]);

    return {
        dropIndex,
        draggedSlidesIds,
        isDragging: draggedSlidesIds.length > 0,
        handleDragStart,
        handleDragOver,
        handleDrop,
    };
}