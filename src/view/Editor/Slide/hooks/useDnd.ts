import { type MouseEventHandler, useEffect, useState } from "react";

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

type ResizeCorner = "tl" | "tr" | "bl" | "br" | "t" | "r" | "l" | "b";

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

    const [isDragging, setIsDragging] = useState(false);
    const [mode, setMode] = useState<"move" | ResizeCorner | null>(null);
    const [top, setTop] = useState(startY);
    const [left, setLeft] = useState(startX);
    const [width, setWidth] = useState(defaultWidth);
    const [height, setHeight] = useState(defaultHeight);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const onMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMode("move");
        setIsDragging(true);
        setOffset({ x: event.clientX - left, y: event.clientY - top });
    };

    const onResizeDown =
        (corner: ResizeCorner): MouseEventHandler<HTMLDivElement> =>
            (event) => {
                event.preventDefault();
                event.stopPropagation();
                setMode(corner);
                setIsDragging(true);
                setOffset({ x: event.clientX, y: event.clientY });
            };

    const handleMouseUp = () => {
        if (!isDragging) return;

        setIsDragging(false);

        if (mode === "move") {
            onFinishMove(left, top);
        } else if (mode) {
            onFinishResize(left, top, width, height);
        }

        setMode(null);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (event: MouseEvent) => {
            if (!mode) return;

            if (mode === "move") {
                setLeft(event.clientX - offset.x);
                setTop(event.clientY - offset.y);
            } else {
                const dx = event.clientX - offset.x;
                const dy = event.clientY - offset.y;

                if (mode.includes("l") || mode.includes("r")) {
                    setWidth((prev) => {
                        let newW = prev;
                        if (mode.includes("r")) newW = prev + dx;
                        if (mode.includes("l")) newW = prev - dx;

                        newW = Math.max(newW, 10);

                        if (mode.includes("l")) {
                            setLeft((prevL) => prevL + dx);
                        }

                        return newW;
                    });
                }

                if (mode.includes("t") || mode.includes("b")) {
                    setHeight((prev) => {
                        let newH = prev;
                        if (mode.includes("b")) newH = prev + dy;
                        if (mode.includes("t")) newH = prev - dy;

                        newH = Math.max(newH, 10);

                        if (mode.includes("t")) {
                            setTop((prevT) => prevT + dy);
                        }

                        return newH;
                    });
                }

                setOffset({ x: event.clientX, y: event.clientY });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, mode, offset.x, offset.y, onFinishMove, onFinishResize]);

    useEffect(() => {
        if (isDragging) return;

        setLeft(startX);
        setTop(startY);
        setWidth(defaultWidth);
        setHeight(defaultHeight);
    }, [startX, startY, defaultWidth, defaultHeight]);

    return {
        top,
        left,
        width,
        height,
        onMouseDown,
        onResizeDown,
    };
}