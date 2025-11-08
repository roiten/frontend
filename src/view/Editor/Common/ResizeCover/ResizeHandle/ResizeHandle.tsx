import joinStyles from "../../../../../utils/joinStyle.ts";
import styles from "./ResizeCover.module.css";
import type { MouseEventHandler } from "react";
import type { ResizeCorner } from "./types.ts";

type ResizeCoverProps = {
    onResizeDown: (corner: ResizeCorner) => MouseEventHandler<HTMLDivElement>;
};

function chooseResizeHandlerStyle(corner: ResizeCorner) {
    switch (corner) {
        case "t":
            return styles.resizeHandleTop;
        case "tr":
            return styles.resizeHandleTopRight;
        case "r":
            return styles.resizeHandleRight;
        case "br":
            return styles.resizeHandleBottomRight;
        case "b":
            return styles.resizeHandleBottom;
        case "bl":
            return styles.resizeHandleBottomLeft;
        case "l":
            return styles.resizeHandleLeft;
        default:
            return styles.resizeHandleTopLeft;
    }
}

function ResizeCover({ onResizeDown }: ResizeCoverProps) {
    return (
        <>
            <div
                className={joinStyles([
                styles.resizeHandle,
            chooseResizeHandlerStyle])}
                onMouseDown={onResizeDown("tl")}
            />
        </>
    );
}

export {
    ResizeCover,
}