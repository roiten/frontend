import { type MouseEventHandler, useEffect, useState } from "react";
import { IMAGE_MIN_SIZE } from "../../../../store/default.ts";
import { type ResizeCorner } from "../../Common/ResizeCover/types.ts";

type DndArgs = {
    startX: number;
    startY: number;
    defaultWidth: number;
    defaultHeight: number;
    onFinishMove: (newX: number, newY: number) => void;
    onFinishResize: (
        newX: number,
        newY: number,
        newW: number,
        newH: number,
    ) => void;
};

type DndResult = {
    top: number;
    left: number;
    width: number;
    height: number;
    onMouseDown: MouseEventHandler<HTMLDivElement>;
    onResizeDown: (corner: ResizeCorner) => MouseEventHandler<HTMLDivElement>;
};

export function useDnd(args: DndArgs): DndResult {
    const {
        startX,
        startY,
        defaultWidth,
        defaultHeight,
        onFinishMove,
        onFinishResize,
    } = args;

    const [dragState, setDragState] = useState<{
        isDragging: boolean;
        mode: "move" | ResizeCorner | null;
        offset: { x: number; y: number };
        position: { x: number; y: number };
        size: { w: number; h: number };
        initial: { x: number; y: number; w: number; h: number };
    }>({
        isDragging: false,
        mode: null,
        offset: { x: 0, y: 0 },
        position: { x: startX, y: startY },
        size: { w: defaultWidth, h: defaultHeight },
        initial: { x: startX, y: startY, w: defaultWidth, h: defaultHeight },
    });

    const onMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragState((prev) => ({
            ...prev,
            mode: "move",
            isDragging: true,
            offset: {
                x: event.clientX - prev.position.x,
                y: event.clientY - prev.position.y,
            },
        }));
    };

    const onResizeDown =
        (corner: ResizeCorner): MouseEventHandler<HTMLDivElement> =>
            (event) => {
                event.preventDefault();
                event.stopPropagation();
                setDragState((prev) => ({
                    ...prev,
                    mode: corner,
                    isDragging: true,
                    offset: { x: event.clientX, y: event.clientY },
                }));
            };

    const handleMouseUp = () => {
        if (!dragState.isDragging) return;

        const { mode, position, size, initial } = dragState;

        if (mode === "move") {
            const hasMoved = position.x !== initial.x || position.y !== initial.y;
            if (hasMoved) {
                onFinishMove(position.x, position.y);
            }
        } else if (mode) {
            const hasResized = size.w !== initial.w || size.h !== initial.h;
            const hasMoved = position.x !== initial.x || position.y !== initial.y;
            if (hasMoved || hasResized) {
                onFinishResize(position.x, position.y, size.w, size.h);
            }
        }

        setDragState(prev => ({
            ...prev,
            isDragging: false,
            mode: null,
            initial: {
                x: position.x,
                y: position.y,
                w: size.w,
                h: size.h,
            },
        }));
    };

    useEffect(() => {
        if (!dragState.isDragging) return;

        const handleMouseMove = (event: MouseEvent) => {
            setDragState((prev) => {
                const { mode, offset, position, size } = prev;
                if (!mode) return prev;

                if (mode === "move") {
                    return {
                        ...prev,
                        position: {
                            x: event.clientX - offset.x,
                            y: event.clientY - offset.y,
                        },
                    };
                } else {
                    const dx = event.clientX - offset.x;
                    const dy = event.clientY - offset.y;
                    const newPos = { ...position };
                    const newSize = { ...size };

                    if (mode.includes("l") || mode.includes("r")) {
                        if (mode.includes("r")) newSize.w = size.w + dx;
                        if (mode.includes("l")) {
                            newSize.w = size.w - dx;
                            newPos.x = position.x + dx;
                        }
                        newSize.w = Math.max(newSize.w, IMAGE_MIN_SIZE);
                    }

                    if (mode.includes("t") || mode.includes("b")) {
                        if (mode.includes("b")) newSize.h = size.h + dy;
                        if (mode.includes("t")) {
                            newSize.h = size.h - dy;
                            newPos.y = position.y + dy;
                        }
                        newSize.h = Math.max(newSize.h, IMAGE_MIN_SIZE);
                    }

                    return {
                        ...prev,
                        position: newPos,
                        size: newSize,
                        offset: { x: event.clientX, y: event.clientY },
                    };
                }
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragState.isDragging, dragState.mode, dragState.offset]);

    useEffect(() => {
        setDragState((prev) => ({
            ...prev,
            position: { x: startX, y: startY },
            size: { w: defaultWidth, h: defaultHeight },
            initial: { x: startX, y: startY, w: defaultWidth, h: defaultHeight },
        }));
    }, [startX, startY, defaultWidth, defaultHeight]);

    return {
        top: dragState.position.y,
        left: dragState.position.x,
        width: dragState.size.w,
        height: dragState.size.h,
        onMouseDown,
        onResizeDown,
    };
}