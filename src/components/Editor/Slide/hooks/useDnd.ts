import { type MouseEventHandler, useEffect, useState } from "react";

type DndArgs = {
    startX: number;
    startY: number;
    onMouseMove?: (newX: number, newY: number) => void;
    onFinish?: (newX: number, newY: number) => void;
};

type DndResult = {
    isDragging: boolean;
    top: number;
    left: number;
    onMouseDown: MouseEventHandler<HTMLDivElement>;
};

export function useDnd(args: DndArgs): DndResult {
    const { startX, startY, onMouseMove, onFinish } = args;

    const [isDragging, setIsDragging] = useState(false);
    const [top, setTop] = useState(startY);
    const [left, setLeft] = useState(startX);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        if (!isDragging) {
            setLeft(startX);
            setTop(startY);
        }
    }, [startX, startY, isDragging]);

    const onMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        setIsDragging(true);
        setOffsetX(left - event.clientX);
        setOffsetY(top - event.clientY);
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging) return;
            const newLeft = offsetX + event.clientX;
            const newTop = offsetY + event.clientY;
            setLeft(newLeft);
            setTop(newTop);
            onMouseMove?.(newLeft, newTop);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isDragging, offsetX, offsetY, onMouseMove]);

    useEffect(() => {
        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                onFinish?.(left, top);
            }
        };
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, [isDragging, left, top, onFinish]);

    return {
        isDragging,
        top,
        left,
        onMouseDown,
    };
}