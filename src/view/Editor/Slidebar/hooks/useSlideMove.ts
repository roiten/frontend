import { useCallback, useEffect, useRef, useState } from "react";
import { moveSlide } from "../../../../store/reducers/slidesReducer.ts";
import { useDispatch } from "react-redux";

export function useSlideMove(
    selectedSlidesIds: string[],
    setIsDragging: (value: boolean) => void,
) {
    const dispatch = useDispatch();
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
            if (index > prev) {
                newIndex = index + 1;
            }
            else if (index < prev) {
                newIndex = index;
            }
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
        dispatch(moveSlide({slideIds: draggedSlidesIds, newIndex: dropIndex}));

        setDraggedSlidesIds([]);
        setDropIndex(null);
        lastHoverIndex.current = null;
        setIsDragging(false);
    }, [draggedSlidesIds, dropIndex, setIsDragging]);

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